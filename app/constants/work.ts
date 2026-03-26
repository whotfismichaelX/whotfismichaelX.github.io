import * as THREE from "three";
import { WorkTimelinePoint } from "../types";

export const WORK_TIMELINE: WorkTimelinePoint[] = [
  {
    point: new THREE.Vector3(0, 0, 0),
    year: '2025',
    title: 'СамГТУ',
    subtitle: 'Бакалавр, Pipeline Engineer',
    description: 'Самарский государственный технический университет.\nИнгт, Эксплуатация трубопроводного транспорта.',
    position: 'right',
  },
  {
    point: new THREE.Vector3(-4, -4, -3),
    year: '2024—2025',
    title: 'AH (HR tech)',
    subtitle: 'Product Manager',
    description: 'Разработка MVP. Презентация для 3 крупных инвесторов.\nCustDev с 20+ пользователями. 200 человек в waiting list.\nУправление командой из 3 человек в условиях ограниченного бюджета.',
    position: 'left',
  },
  {
    point: new THREE.Vector3(-3, -1, -6),
    year: '2025—2026',
    title: 'Статица — Juridex',
    subtitle: 'Product Manager',
    description: '0→1 B2B SaaS для автоматизации поиска клиентов юристами.\nЗапуск от идеи до продукта за 4 месяца. 40+ CustDev интервью.\nВнедрил Scrum/Kanban — ускорение разработки на 60%.\nЯндекс Метрика + SEO: DAU +30%, позиции в поиске +433%.',
    position: 'left',
  },
  {
    point: new THREE.Vector3(1, 1, -12),
    year: new Date().toLocaleDateString('default', { year: 'numeric' }),
    title: 'Что дальше?',
    subtitle: 'Открыт к предложениям',
    position: 'right',
  }
]
