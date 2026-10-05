import { createApp } from 'vue';
import 'leaflet/dist/leaflet.css';
import './style.css';
import App from './app.vue';
import router from './router.js';
import i18n from './i18n.js';
import pinia from './pinia.js';
import PrimeVue from 'primevue/config';
import Material from '@primeuix/themes/material';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import Tooltip from 'primevue/tooltip';

import {
    Avatar, Button, Card, Column, ConfirmDialog, DataTable, Dialog, Drawer,
    FileUpload, FloatLabel, IconField, InputIcon, InputNumber, InputText,
    Menu, Menubar, Popover, Rating, Row, Select, SelectButton, Tag, Textarea,
    Toast, Toolbar
} from 'primevue';
import ConfirmationService from 'primevue/confirmationservice';
import DialogService from 'primevue/dialogservice';
import ToastService from 'primevue/toastservice';

const primeUiLicenseKey = import.meta.env.VITE_PRIME_UI_LICENSE_KEY;

createApp(App)
    .use(router)
    .use(i18n)
    .use(pinia)
    .use(PrimeVue, {
        theme: { preset: Material },
        ripple: true,
        license: primeUiLicenseKey
    })
    .use(ConfirmationService)
    .use(DialogService)
    .use(ToastService)
    .component('pv-avatar',        Avatar)
    .component('pv-button',        Button)
    .component('pv-card',          Card)
    .component('pv-column',        Column)
    .component('pv-confirm-dialog', ConfirmDialog)
    .component('pv-data-table',    DataTable)
    .component('pv-dialog',        Dialog)
    .component('pv-drawer',        Drawer)
    .component('pv-file-upload',   FileUpload)
    .component('pv-float-label',   FloatLabel)
    .component('pv-icon-field',    IconField)
    .component('pv-input-icon',    InputIcon)
    .component('pv-input-number',  InputNumber)
    .component('pv-input-text',    InputText)
    .component('pv-menu',          Menu)
    .component('pv-menubar',       Menubar)
    .component('pv-popover',       Popover)
    .component('pv-rating',        Rating)
    .component('pv-row',           Row)
    .component('pv-select',        Select)
    .component('pv-select-button', SelectButton)
    .component('pv-tag',           Tag)
    .component('pv-textarea',      Textarea)
    .component('pv-toast',         Toast)
    .component('pv-toolbar',       Toolbar)
    .directive('tooltip',          Tooltip)
    .mount('#app');