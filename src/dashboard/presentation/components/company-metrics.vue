<script setup>
defineProps({
  eyebrow: { type: String, default: 'Operational KPIs' },
  title: { type: String, default: 'Performance summary' },
  items: { type: Array, required: true }
});
</script>

<template>
  <section class="operations-card">
    <div class="section-heading">
      <div>
        <p>{{ eyebrow }}</p>
        <h2>{{ title }}</h2>
      </div>
      <span>{{ items.length }} KPIs</span>
    </div>

    <div class="operation-list">
      <article v-for="item in items" :key="item.id" class="operation-item">
        <div class="operation-icon">
          <i class="material-symbols-outlined">{{ item.icon }}</i>
        </div>
        <div class="operation-body">
          <div class="operation-title">
            <strong>{{ item.label }}</strong>
            <span>{{ item.value }}</span>
          </div>
          <p>{{ item.helper }}</p>
          <div class="progress-track" aria-hidden="true">
            <div class="progress-fill" :style="{ width: item.progress + '%' }"></div>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>

<style scoped>
.operations-card {
  height: 100%;
  border: 1px solid var(--kw-border);
  border-radius: 24px;
  background: var(--kw-card);
  box-shadow: var(--kw-shadow);
  padding: 1.2rem;
}

.section-heading {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: flex-start;
  margin-bottom: 1rem;
}
.section-heading p {
  margin: 0 0 .25rem;
  color: var(--kw-blue-700);
  font-weight: 900;
  font-size: .78rem;
  letter-spacing: .12em;
  text-transform: uppercase;
}
.section-heading h2 { margin: 0; font-size: clamp(1.25rem, 1.8vw, 1.7rem); }
.section-heading span {
  border-radius: 999px;
  background: rgba(255, 181, 46, .18);
  color: #92400e;
  font-weight: 800;
  padding: .3rem .65rem;
  font-size: .75rem;
}

.operation-list { display: grid; gap: .9rem; }
.operation-item {
  display: grid;
  grid-template-columns: 44px 1fr;
  gap: .8rem;
  padding: .9rem;
  border-radius: 18px;
  background: rgba(248, 251, 255, .82);
  border: 1px solid rgba(17, 24, 39, .06);
}
body.dark-theme .operation-item { background: rgba(255,255,255,.04); }

.operation-icon {
  width: 44px;
  height: 44px;
  border-radius: 16px;
  color: var(--kw-blue-700);
  background: rgba(34, 131, 198, .12);
  display: grid;
  place-items: center;
}

.operation-title { display: flex; justify-content: space-between; gap: .75rem; align-items: center; }
.operation-title strong { font-size: .95rem; }
.operation-title span { font-weight: 900; color: var(--kw-blue-900); }
p { margin: .15rem 0 .55rem; color: var(--kw-muted); font-size: .82rem; }

.progress-track {
  height: 8px;
  border-radius: 999px;
  background: rgba(34, 131, 198, .12);
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, var(--kw-blue-700), #1ec3a6);
}
</style>