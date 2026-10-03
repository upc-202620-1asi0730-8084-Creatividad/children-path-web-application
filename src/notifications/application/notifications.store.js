import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { NotificationsApi } from '../infrastructure/notifications-api.js';
import { fallbackNotifications, summaryFrom } from '../domain/models/notification.model.js';

const notificationsApi = new NotificationsApi();

const useNotificationsStore = defineStore('notifications', () => {
    // ---- State ----
    const items = ref([]);
    const activities = ref([]);
    const loading = ref(false);
    const loaded = ref(false);
    const errors = ref([]);

    // ---- Computed ----
    const summary = computed(() => summaryFrom(items.value));
    const unreadCount = computed(() => items.value.filter((i) => i.status === 'new').length);
    const topbarItems = computed(() => items.value.slice(0, 4));
    const alertItems = computed(() => items.value.filter((i) => i.category === 'alert'));
    const notificationItems = computed(() => items.value.filter((i) => i.category === 'notification'));

    // ---- Actions ----
    async function fetchDashboard(force = false) {
        if (loaded.value && !force) return;
        loading.value = true;
        try {
            const response = await notificationsApi.getDashboard();
            const data = response.data;
            items.value = data.items ?? [];
            activities.value = data.activities ?? [];
            loaded.value = true;
            errors.value = [];
        } catch (error) {
            const fallback = fallbackNotifications();
            items.value = fallback.items;
            activities.value = fallback.activities;
            loaded.value = true;
            errors.value.push(error);
        } finally {
            loading.value = false;
        }
    }

    function filteredItems(category, priority, status, query) {
        const normalizedQuery = query.trim().toLowerCase();
        return items.value.filter((item) => {
            const matchesCategory = category === 'all' || item.category === category;
            const matchesPriority = priority === 'all' || item.priority === priority;
            const matchesStatus = status === 'all' || item.status === status;
            const searchable = `${item.title} ${item.message} ${item.routeName ?? ''} ${item.vehiclePlate ?? ''} ${item.sourceBc}`.toLowerCase();
            const matchesQuery = !normalizedQuery || searchable.includes(normalizedQuery);
            return matchesCategory && matchesPriority && matchesStatus && matchesQuery;
        });
    }

    function markAsRead(id) {
        updateItem(id, { status: 'read' });
    }

    function acknowledge(id) {
        updateItem(id, { status: 'acknowledged' });
    }

    function markAllAsRead() {
        items.value = items.value.map((item) =>
            item.status === 'new' ? { ...item, status: 'read' } : item
        );
    }

    function remove(id) {
        items.value = items.value.filter((item) => item.id !== id);
    }

    function updateItem(id, changes) {
        items.value = items.value.map((item) =>
            item.id === id ? { ...item, ...changes } : item
        );
    }

    function exportCsv(list) {
        const header = ['id', 'category', 'priority', 'status', 'title', 'sourceBc', 'vehiclePlate', 'routeName', 'time'];
        const rows = list.map((item) => [
            item.id,
            item.category,
            item.priority,
            item.status,
            item.title,
            item.sourceBc,
            item.vehiclePlate ?? '',
            item.routeName ?? '',
            item.time
        ]);
        const csv = [header, ...rows]
            .map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(','))
            .join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = 'children-path-alerts-notifications.csv';
        anchor.click();
        URL.revokeObjectURL(url);
    }

    function iconFor(item) {
        const iconMap = {
            delay: 'schedule',
            attendance: 'fact_check',
            incident: 'report_problem',
            route: 'alt_route',
            payment: 'payments',
            system: 'settings',
            safety: 'health_and_safety',
            maintenance: 'construction'
        };
        return iconMap[item.type] ?? 'notifications';
    }

    return {
        // state
        items,
        activities,
        loading,
        loaded,
        errors,
        // computed
        summary,
        unreadCount,
        topbarItems,
        alertItems,
        notificationItems,
        // actions
        fetchDashboard,
        filteredItems,
        markAsRead,
        acknowledge,
        markAllAsRead,
        remove,
        exportCsv,
        iconFor
    };
});
