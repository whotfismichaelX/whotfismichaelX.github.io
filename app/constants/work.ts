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
    point: new THREE.Vector3(4, -1, -9),
    year: '2026—н.в.',
    title: 'ООО «ТОР»',
    subtitle: 'Product Manager',
    description: 'AI-продукт для автоматизации Red Team-сценариев.\nЗапустил продукт за 4 месяца; провёл 15+ интервью.\nНа одной тестовой выборке: FPR 70%→4%, Initial Access 60%→83%.\nОколо 400 тыс. ₽ выручки за период работы.',
    position: 'right',
  },
  {
    point: new THREE.Vector3(5, 3, -12),
    year: '2026',
    title: 'Сертификаты',
    subtitle: 'Cisco & OpenAI Academy',
    description: 'Cisco: Junior Cybersecurity Analyst Career Path.\nOpenAI: Apply AI at Work (до 28 марта 2027).',
    links: [
      { label: 'Cisco — Junior Cybersecurity Analyst Career Path ↗', url: '/certificates/cisco-junior-cybersecurity-analyst.pdf' },
      { label: 'OpenAI Academy — Apply AI at Work ↗', url: '/certificates/openai-apply-ai-at-work.pdf' },
    ],
    position: 'left',
  },
  {
    point: new THREE.Vector3(1, 1, -15),
    year: new Date().toLocaleDateString('default', { year: 'numeric' }),
    title: 'Что дальше?',
    subtitle: 'Открыт к предложениям',
    position: 'right',
  }
]
