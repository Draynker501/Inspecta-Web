import {
  IonIcon
} from "@ionic/react";

import {
  shieldCheckmarkOutline,
  warningOutline,
  clipboardOutline,
  checkmarkDoneOutline,
  arrowUpOutline,
  arrowDownOutline,
  chevronForwardOutline,
  flameOutline,
  constructOutline,
  glassesOutline,
  statsChartOutline
} from "ionicons/icons";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  CartesianGrid
} from "recharts";

const complianceData = [
  { month: "May", value: 78 },
  { month: "Jun", value: 82 },
  { month: "Jul", value: 79 },
  { month: "Ago", value: 86 },
  { month: "Sep", value: 89 }
];

const incidentsData = [
  { name: "Bajo", value: 8 },
  { name: "Medio", value: 5 },
  { name: "Crítico", value: 2 }
];

const inspections = [
  {
    id: "INS-001",
    type: "EPP",
    icon: glassesOutline,
    area: "Producción",
    date: "29 Sep",
    status: "Completada",
    compliance: 92
  },
  {
    id: "INS-002",
    type: "Protección contra incendios",
    icon: flameOutline,
    area: "Almacén",
    date: "29 Sep",
    status: "En proceso",
    compliance: 76
  },
  {
    id: "INS-003",
    type: "Maquinaria y equipo",
    icon: constructOutline,
    area: "Línea 3",
    date: "30 Sep",
    status: "Pendiente",
    compliance: 0
  }
];

const actions = [
  {
    title: "Corregir obstrucción en ruta de evacuación",
    area: "Producción",
    deadline: "30 Sep",
    status: "Urgente"
  },
  {
    title: "Reemplazar EPP deteriorado",
    area: "Línea 2",
    deadline: "02 Oct",
    status: "Pendiente"
  },
  {
    title: "Actualizar señalización",
    area: "Almacén",
    deadline: "05 Oct",
    status: "En proceso"
  }
];

export default function Dashboard() {
  return (
    <div className="inspecta-dashboard">

      {/* HEADER */}

      <div className="dashboard-header">

       <div>

  <div className="dashboard-title-row">

    <div>

      <span className="dashboard-kicker">
        RESUMEN GENERAL
      </span>

      <h1>
        Buenos días, Santiago
      </h1>

      <p>
        Este es el estado actual de seguridad e higiene de tu planta.
      </p>

    </div>


  </div>

</div>

        <div className="dashboard-actions">

          <button className="date-button">
            Septiembre 2026
          </button>

          <button className="primary-button">
            + Nueva inspección
          </button>

        </div>

      </div>


      {/* METRIC CARDS */}

      <div className="metric-grid">

        <MetricCard
          icon={shieldCheckmarkOutline}
          title="Cumplimiento general"
          value="89%"
          detail="+4.2% este mes"
          trend="up"
          type="teal"
        />

        <MetricCard
          icon={clipboardOutline}
          title="Inspecciones"
          value="128"
          detail="+12 este mes"
          trend="up"
          type="blue"
        />

        <MetricCard
          icon={warningOutline}
          title="Incidencias abiertas"
          value="14"
          detail="-3 esta semana"
          trend="down"
          type="orange"
        />

        <MetricCard
          icon={checkmarkDoneOutline}
          title="Acciones pendientes"
          value="27"
          detail="+5 esta semana"
          trend="up"
          type="purple"
        />

      </div>


      {/* MAIN GRID */}

      <div className="dashboard-main-grid">

        {/* COMPLIANCE */}

        <section className="dashboard-card compliance-card">

          <div className="card-header">

            <div>
              <span className="card-label">
                INDICADOR
              </span>

              <h2>Tendencia de cumplimiento</h2>
            </div>

            <button className="small-filter">
              Mensual
            </button>

          </div>


          <div className="compliance-content">

            <div className="compliance-number">
              <strong>89%</strong>

              <span>
                <IonIcon icon={arrowUpOutline} />
                4.2%
              </span>

              <small>
                respecto al mes anterior
              </small>
            </div>


            <div className="chart-container">

              <ResponsiveContainer width="100%" height={220}>

                <AreaChart data={complianceData}>

                  <defs>

                    <linearGradient
                      id="complianceGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >

                      <stop
                        offset="0%"
                        stopColor="#0F9D8A"
                        stopOpacity={0.35}
                      />

                      <stop
                        offset="100%"
                        stopColor="#0F9D8A"
                        stopOpacity={0}
                      />

                    </linearGradient>

                  </defs>

                  <CartesianGrid
                    stroke="#E8EEF2"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: "#81909D" }}
                  />

                  <YAxis
                    domain={[60, 100]}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: "#81909D" }}
                  />

                  <Tooltip />

                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#0F9D8A"
                    strokeWidth={3}
                    fill="url(#complianceGradient)"
                  />

                </AreaChart>

              </ResponsiveContainer>

            </div>

          </div>

        </section>


        {/* INCIDENTS */}

        <section className="dashboard-card">

          <div className="card-header">

            <div>
              <span className="card-label">
                SEGURIDAD
              </span>

              <h2>Incidencias por severidad</h2>
            </div>

            <IonIcon
              className="card-header-icon"
              icon={statsChartOutline}
            />

          </div>


          <div className="incident-chart">

            <ResponsiveContainer width="100%" height={220}>

              <BarChart data={incidentsData}>

                <CartesianGrid
                  stroke="#E8EEF2"
                  vertical={false}
                />

                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11 }}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />

                <Tooltip />

                <Bar
                  dataKey="value"
                  radius={[8, 8, 0, 0]}
                  fill="#16324F"
                />

              </BarChart>

            </ResponsiveContainer>

          </div>


          <div className="severity-summary">

            <Severity
              color="low"
              label="Bajo"
              value="8"
            />

            <Severity
              color="medium"
              label="Medio"
              value="5"
            />

            <Severity
              color="critical"
              label="Crítico"
              value="2"
            />

          </div>

        </section>

      </div>


      {/* LOWER GRID */}

      <div className="dashboard-lower-grid">


        {/* INSPECTIONS */}

        <section className="dashboard-card">

          <div className="card-header">

            <div>

              <span className="card-label">
                ACTIVIDAD
              </span>

              <h2>Inspecciones recientes</h2>

            </div>

            <button className="link-button">
              Ver todas
            </button>

          </div>


          <div className="inspection-list">

            {inspections.map((inspection) => (

              <div
                className="inspection-row"
                key={inspection.id}
              >

                <div className="inspection-icon">

                  <IonIcon
                    icon={inspection.icon}
                  />

                </div>


                <div className="inspection-info">

                  <strong>
                    {inspection.type}
                  </strong>

                  <span>
                    {inspection.id} · {inspection.area}
                  </span>

                </div>


                <div className="inspection-date">
                  {inspection.date}
                </div>


                <div>

                  <span
                    className={`status-pill ${
                      inspection.status === "Completada"
                        ? "success"
                        : inspection.status === "En proceso"
                        ? "medium"
                        : "low"
                    }`}
                  >

                    {inspection.status}

                  </span>

                </div>


                <div className="inspection-progress">

                  <strong>
                    {inspection.compliance}%
                  </strong>

                  <div className="mini-progress">

                    <span
                      style={{
                        width: `${inspection.compliance}%`
                      }}
                    />

                  </div>

                </div>


                <IonIcon
                  className="row-arrow"
                  icon={chevronForwardOutline}
                />

              </div>

            ))}

          </div>

        </section>


        {/* ACTIONS */}

        <section className="dashboard-card">

          <div className="card-header">

            <div>

              <span className="card-label">
                SEGUIMIENTO
              </span>

              <h2>Acciones correctivas</h2>

            </div>

            <button className="link-button">
              Ver todas
            </button>

          </div>


          <div className="action-list">

            {actions.map((action, index) => (

              <div
                className="action-row"
                key={index}
              >

                <div className="action-status" />

                <div>

                  <strong>
                    {action.title}
                  </strong>

                  <span>
                    {action.area} · Fecha límite {action.deadline}
                  </span>

                </div>

                <span
                  className={`action-pill ${
                    action.status === "Urgente"
                      ? "critical"
                      : action.status === "En proceso"
                      ? "medium"
                      : "low"
                  }`}
                >
                  {action.status}
                </span>

              </div>

            ))}

          </div>

        </section>

      </div>

    </div>
  );
}


function MetricCard({
  icon,
  title,
  value,
  detail,
  trend,
  type
}: {
  icon: string;
  title: string;
  value: string;
  detail: string;
  trend: "up" | "down";
  type: string;
}) {

  return (

    <article className={`metric-card ${type}`}>

      <div className="metric-top">

        <div className="metric-icon">

          <IonIcon icon={icon} />

        </div>

        <span>
          Este mes
        </span>

      </div>


      <span className="metric-title">
        {title}
      </span>


      <strong className="metric-value">
        {value}
      </strong>


      <small className={trend === "up" ? "trend-positive" : "trend-negative"}>

        <IonIcon
          icon={
            trend === "up"
              ? arrowUpOutline
              : arrowDownOutline
          }
        />

        {detail}

      </small>

    </article>

  );
}


function Severity({
  color,
  label,
  value
}: {
  color: string;
  label: string;
  value: string;
}) {

  return (

    <div className="severity-item">

      <span className={`severity-dot ${color}`} />

      <span>
        {label}
      </span>

      <strong>
        {value}
      </strong>

    </div>

  );
}