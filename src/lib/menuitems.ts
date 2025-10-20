export type BaseItem = {
  icon?: string;
  label: string;
  visible: string[];
};

export type LeafItem = BaseItem & {
  href: string;
  children?: never;
};

export type ParentItem = BaseItem & {
  href?: never;
  children: LeafItem[];
};

export type Item = LeafItem | ParentItem;

export const menuItems: { title: string; items: Item[] }[] = [
  {
    title: "MENU",
    items: [
      /* --- Inicio --- */
      {
        icon: "/home.png",
        label: "Inicio",
        href: "/dashboard",
        visible: ["admin", "teacher", "student", "parent", "director"],
      },

      /* --- Admisiones --- */
      {
        icon: "/student.png",
        label: "Admisiones",
        visible: ["director", "admin"],
        children: [
          {
            icon: "/student.png",
            label: "Aspirantes",
            href: "/dashboard/list/admissions",
            visible: ["director", "admin"],
          },
           {
             icon: "/result.png",
             label: "Convenios",
             href: "/dashboard/list/convenios",
             visible: ["director", "admin"],
           },
        ],
      },

      /* --- Inscripciones --- */
      {
        icon: "/subject.png",
        label: "Inscripciones",
        visible: ["admin", "teacher"],
        children: [
          {
            icon: "/subject.png",
            label: "Inscribir aspirante",
            href: "/dashboard/list/Inscripciones",
            visible: ["admin", "teacher"],
          },
          {
            icon: "/subject.png",
            label: "Reinscripciones",
            href: "/dashboard/list/re-registration",
            visible: ["admin", "teacher"],
          },
          {
            icon: "/subject.png",
            label: "Cambios de grupo/plan",
            href: "/dashboard/list/enrollments",
            visible: ["admin", "teacher"],
          },
          {
            icon: "/subject.png",
            label: "Becas y descuentos #En Construcción#",
            href: "#",
            visible: ["admin"],
          },
          {
            icon: "/settings.png",
            label: "Configuración de Inscripciones #En Construcción#",
            href: "#",
            visible: ["admin"],
          },
        ],
      },

      /* --- Operación Escolar --- */
      {
        icon: "/attendance.png",
        label: "Operación Escolar",
        visible: ["admin", "teacher"],
        children: [
          {
            icon: "/attendance.png",
            label: "Listado de estudiantes por grupos",
            href: "/dashboard/list/student",
            visible: ["admin", "teacher", "student", "parent"],
          },      
          {
            icon: "/attendance.png",
            label: "Asistencias",
            href: "/list/attendance",
            visible: ["admin", "teacher", "student", "parent"],
          },
          {
            icon: "/class.png",
            label: "Cargas académicas",
            href: "/dashboard/operations/course-enrollments",
            visible: ["admin", "teacher"],
          },
          {
            icon: "/class.png",
            label: "Movimientos escolares",
            href: "/dashboard/operations/movements",
            visible: ["admin"],
          },
          {
            icon: "/class.png",
            label: "Constancias / Certificados",
            href: "/dashboard/operations/certificates",
            visible: ["admin"],
          },
          {
            icon: "/settings.png",
            label: "Config. Operación",
            href: "/dashboard/settings/operations",
            visible: ["admin"],
          },
        ],
      },

      /* --- Gestión Académica --- */
      {
        icon: "/lesson.png",
        label: "Gestión Académica",
        visible: ["admin", "teacher"],
        children: [
          {
            icon: "/lesson.png",
            label: "Ciclos escolares",
            href: "/dashboard/list/schoolyears",
            visible: ["admin"],
          },
          // {
          //   icon: "/lesson.png",
          //   label: "Campus / Sedes",
          //   href: "/dashboard/list/campuses",
          //   visible: ["admin"],
          // },
          {
            icon: "/lesson.png",
            label: "Planes de estudio",
            href: "/dashboard/list/programs",
            visible: ["admin"],
          },
          {
            icon: "/subject.png",
            label: "Materias",
            href: "/dashboard/list/subjects",
            visible: ["admin"],
          },
          {
            icon: "/lesson.png",
            label: "Horarios",
            href: "/dashboard/list/schedules",
            visible: ["admin", "teacher"],
          },
          {
            icon: "/subject.png",
            label: "Grupos",
            href: "/dashboard/list/groups",
            visible: ["admin"],
          },
          {
            icon: "/settings.png",
            label: "Config. Académica",
            href: "/dashboard/settings/academics",
            visible: ["admin"],
          },
        ],
      },

      /* --- Evaluación Académica --- */
      {
        icon: "/exam.png",
        label: "Evaluación Académica",
        visible: ["admin", "teacher", "parent", "director"],
        children: [
          {
            icon: "/exam.png",
            label: "Exámenes",
            href: "/list/exams",
            visible: ["admin", "teacher", "parent", "director"],
          },
          {
            icon: "/result.png",
            label: "Calificaciones",
            href: "/dashboard/academics/grades",
            visible: ["admin", "teacher", "parent", "director"],
          },
          {
            icon: "/lesson.png",
            label: "Periodos de evaluación",
            href: "/dashboard/academics/terms",
            visible: ["admin", "director", "director"],
          },
          {
            icon: "/result.png",
            label: "Actas / Cierre",
            href: "/dashboard/academics/gradebooks",
            visible: ["admin", "teacher", "director"],
          },
          {
            icon: "/result.png",
            label: "Kardex / Historial",
            href: "/dashboard/academics/transcripts",
            visible: ["admin", "teacher", "parent", "director"],
          },
          {
            icon: "/settings.png",
            label: "Config. de Evaluación",
            href: "/dashboard/settings/grading",
            visible: ["admin", "director"],
          },
        ],
      },

      /* --- Gestión de Personal Académico --- */
      {
        icon: "/teacher.png",
        label: "Gestión de Personal Académico",
        visible: ["admin", "teacher"],
        children: [
          {
            icon: "/teacher.png",
            label: "Profesores",
            href: "/dashboard/list/teachers",
            visible: ["admin", "teacher"],
          },
          {
            icon: "/student.png",
            label: "Coordinadores",
            href: "/dashboard/list/coordinators",
            visible: ["admin"],
          },
          {
            icon: "/class.png",
            label: "Asignación de carga",
            href: "/dashboard/staff/teaching-load",
            visible: ["admin"],
          },
          {
            icon: "/settings.png",
            label: "Config. de Personal",
            href: "/dashboard/settings/staff",
            visible: ["admin"],
          },
        ],
      },

      /* --- Gestión Financiera --- */
      {
        icon: "/dollar.png",
        label: "Gestión Financiera",
        visible: ["admin", "accounting", "cashier"],
        children: [
          // Tablero
          {
            icon: "/dashboard.png",
            label: "Tablero",
            href: "/dashboard/finance/overview",
            visible: ["admin", "accounting", "cashier"],
          },

          // Catálogos
          {
            icon: "/catalog.png",
            label: "Conceptos",
            href: "/dashboard/finance/catalogs/concepts",
            visible: ["admin", "accounting"],
          },
          {
            icon: "/calendar.png",
            label: "Calendarios de cobro",
            href: "/dashboard/finance/catalogs/schedules",
            visible: ["admin", "accounting"],
          },
          {
            icon: "/discount.png",
            label: "Becas y descuentos",
            href: "/dashboard/finance/catalogs/discounts",
            visible: ["admin", "accounting"],
          },

          // Operación
          {
            icon: "/bill.png",
            label: "Generar adeudos",
            href: "/dashboard/finance/billing",
            visible: ["admin", "accounting"],
          },
          {
            icon: "/debt.png",
            label: "Cuentas por cobrar",
            href: "/dashboard/finance/receivables",
            visible: ["admin", "accounting"],
          },
          {
            icon: "/cash.png",
            label: "Pagos",
            href: "/dashboard/finance/payments",
            visible: ["admin", "accounting", "cashier"],
          },
          {
            icon: "/cashier.png",
            label: "Caja del día",
            href: "/dashboard/finance/cashier",
            visible: ["admin", "cashier"],
          },
          {
            icon: "/bank.png",
            label: "Conciliación bancaria",
            href: "/dashboard/finance/reconciliation",
            visible: ["admin", "accounting"],
          },

          // Opcional: Facturación (si aplica)
          {
            icon: "/invoice.png",
            label: "Facturación",
            href: "/dashboard/finance/invoicing",
            visible: ["admin", "accounting"],
          },

          // Reportes y configuración
          {
            icon: "/report.png",
            label: "Reportes",
            href: "/dashboard/finance/reports",
            visible: ["admin", "accounting"],
          },
          {
            icon: "/settings.png",
            label: "Configuración",
            href: "/dashboard/finance/settings",
            visible: ["admin"],
          },
        ],
      },

      /* --- Comunidad & Comunicación --- */
      {
        icon: "/message.png",
        label: "Comunidad & Comunicación",
        visible: ["admin", "teacher", "student", "parent"],
        children: [
          {
            icon: "/student.png",
            label: "Estudiantes",
            href: "/dashboard/list/student",
            visible: ["admin", "teacher"],
          },
          {
            icon: "/parent.png",
            label: "Padres / Tutores",
            href: "/list/parents",
            visible: ["admin", "teacher"],
          },
          {
            icon: "/message.png",
            label: "Mensajes",
            href: "/list/messages",
            visible: ["admin", "teacher", "student", "parent"],
          },
          {
            icon: "/announcement.png",
            label: "Anuncios",
            href: "/list/announcements",
            visible: ["admin", "teacher", "student", "parent"],
          },
          {
            icon: "/calendar.png",
            label: "Eventos",
            href: "/list/events",
            visible: ["admin", "teacher", "student", "parent"],
          },
          {
            icon: "/settings.png",
            label: "Config. de Comunicación",
            href: "/dashboard/settings/comms",
            visible: ["admin"],
          },
        ],
      },

      /* --- Reportes --- */
      {
        icon: "/result.png",
        label: "Reportes",
        visible: ["admin", "teacher"],
        children: [
          {
            icon: "/result.png",
            label: "Inscritos por ciclo/plan/grupo",
            href: "/dashboard/reports/enrollments",
            visible: ["admin", "teacher"],
          },
          {
            icon: "/result.png",
            label: "Reprobación y eficiencia",
            href: "/dashboard/reports/grades",
            visible: ["admin", "teacher"],
          },
          {
            icon: "/result.png",
            label: "Ocupación de aulas / choques",
            href: "/dashboard/reports/rooms",
            visible: ["admin", "teacher"],
          },
          {
            icon: "/result.png",
            label: "Avance de captura",
            href: "/dashboard/reports/progress",
            visible: ["admin", "teacher"],
          },
        ],
      },
    ],
  },
];