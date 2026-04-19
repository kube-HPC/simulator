# HKube Simulator — Onboarding Guide

---

## Part 1: Easy Onboarding

### What Is This Project?

The **HKube Simulator** (also called the **HKube Dashboard**) is a React-based web application that serves as the management and monitoring UI for the [HKube](https://github.com/kube-HPC/hkube) platform — a Kubernetes-native framework for running distributed data-processing pipelines. It allows users to:

- View and manage **pipelines** (stored workflow definitions)
- Execute, pause, resume, and stop **jobs** (pipeline runs)
- Register, version, build, and delete **algorithms**
- Monitor **workers** and **pipeline drivers** in real time
- Inspect **queue** ordering (managed/preferred job queues)
- Manage **data sources** and their versions/snapshots
- View **node statistics**, **error logs**, and **resource usage** (CPU, GPU, memory)

The dashboard does **not** contain simulator/computation logic itself — it is purely a control-plane UI that talks to the HKube **API Server** and **Monitor Server** backends via REST and GraphQL.

---

### Core Concepts and Terminology

| Term                         | Meaning                                                                                                                                                 |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Pipeline**                 | A stored DAG of algorithm nodes that defines a workflow.                                                                                                |
| **Job**                      | A single execution of a pipeline. Identified by a `jobId` / `key`. Has statuses: `pending`, `active`, `completed`, `failed`, `stopped`, `stalled`, etc. |
| **Algorithm**                | A user-provided compute unit (container image or code build). Versioned and buildable from the UI.                                                      |
| **Worker**                   | A Kubernetes pod executing a single algorithm task. Grouped by `algorithmName`.                                                                         |
| **Driver** (Pipeline Driver) | A component that orchestrates pipeline execution, scheduling tasks to workers.                                                                          |
| **Experiment**               | A logical namespace that groups jobs (default: `main`).                                                                                                 |
| **Queue**                    | Pending jobs waiting for resources, split into **managed** and **preferred** lists.                                                                     |
| **Data Source**              | An external data set registered in HKube, with versioning and snapshots.                                                                                |
| **Node Statistics**          | Per-algorithm resource consumption and scheduling metrics.                                                                                              |
| **Discovery**                | Live cluster topology: drivers, workers, and task-executor state.                                                                                       |
| **Board**                    | TensorBoard-like visualization integration for algorithm output.                                                                                        |

---

### Architecture Overview

```
┌───────────────────────────────────────────────────────┐
│                     Browser                           │
│                                                       │
│  React 18 + Redux Toolkit + Apollo Client (GraphQL)   │
│  UI: Ant Design 6 + styled-components + AG Grid       │
│  Routing: react-router-dom (HashRouter)               │
│  Auth: Keycloak (optional)                            │
│  Editor: Monaco Editor                                │
│  Charts: ApexCharts + Nivo                            │
└──────────────┬────────────────────┬───────────────────┘
               │ REST (axios)       │ GraphQL (Apollo)
               ▼                    ▼
┌──────────────────────────────────────────────────────┐
│           HKube API Server  /hkube/api-server        │
│           + Monitor Server  (GraphQL endpoint)       │
└──────────────────────────────────────────────────────┘
```

**Key architectural decisions:**

- **Vite** is the build tool (port 9050 dev, production served by a minimal Express server).
- **Redux Toolkit** holds connection/config state and legacy socket-sourced entity data (algorithms, jobs, pipelines, workers, drivers, etc.) — all normalized via `createEntityAdapter`.
- **Apollo Client + GraphQL polling** is the primary real-time data mechanism. The legacy socket middleware is commented out; data now arrives through periodic GraphQL queries.
- **Custom Redux middleware** (`restMiddleware`, `restConfigMiddleware`, `messagesMiddleware`) handles REST calls and user-facing success/error messages via Ant Design's `message` API.
- **Reactive variables** (`makeVar`) in Apollo cache manage cross-component UI state: filters, counters, activity mode, date ranges.

---

### Data Flow Explanation

#### 1. Bootstrap / Configuration

1. App mounts → dispatches `initDashboardConfig()`.
2. `restConfigMiddleware` fetches `/dashboard-config.json` (served by Express server or Vite middleware in dev).
3. On success, `restMiddleware` intercepts `SOCKET_GET_CONFIG_SUCCESS`, extracts `monitorBackend`, computes backend URL, sets `axios.defaults.baseURL`, and dispatches `connectionSetup(...)` into the Redux `connection` slice.
4. `config.reducer` stores `backendApiUrl` and sets `hasConfig: true` → the UI renders.

#### 2. GraphQL Data Fetching (Primary Path)

1. `Routes/index.jsx` mounts, calls `socketInit()`, and initializes `ApolloProvider` with the dynamically-created Apollo client.
2. Individual table pages (Jobs, Algorithms, Pipelines, Workers, Drivers, Queue, DataSources) use custom hooks (e.g., `useJobsFunctionsLimit`, `useJobsGrid`, `useCounters`, `useDiscovery`) that call `useQuery(...)` with a GraphQL query.
3. Each hook registers polling via `usePolling(query, intervalMs)`, which stores the query in a global `queryMap` and calls `query.startPolling(interval)`.
4. Typical polling intervals: **2–3 seconds** for jobs, **3 seconds** for grid views.
5. The `usePolling` system includes **inactivity detection**: if no mouse/keyboard/scroll activity for a configurable period (default 5 minutes), all polling stops and an "Inactive Mode" reactive variable is set. Polling resumes on user interaction.

#### 3. REST Mutations (Write Path)

1. User actions (add pipeline, run algorithm, stop job, etc.) dispatch Redux actions with types like `REST_REQ_POST`, `REST_REQ_DELETE`.
2. `restMiddleware` intercepts these, calls the appropriate axios method against the API server.
3. On success/failure, it dispatches `_SUCCESS` / `_REJECT` actions with metadata for toast messages.
4. After any successful POST/PUT/DELETE, `forceRefetchAll()` is called — this iterates over all registered polling queries and triggers an immediate `refetch()`.

#### 4. Redux State (Legacy + Config)

Reducers still listen for `SOCKET_GET_DATA` (originally from WebSocket pushes). Many reducers (jobs, algorithms, pipelines, workers, drivers, queue, nodeStatistics) parse a payload object keyed by entity type and use **hash-sum comparison** to skip re-renders when data hasn't changed.

---

### Key Modules

| Path                              | Responsibility                                                                                                                                                                        |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `server/`                         | Minimal Express server for production. Serves static build, injects `dashboard-config.json` from env vars.                                                                            |
| `src/index.jsx`                   | App entry. Redux `Provider`, Keycloak init, theme, `ConfigProviderApp`.                                                                                                               |
| `src/store.js`                    | Redux store. Combines `restConfigMiddleware`, `restMiddleware`, `messagesMiddleware`.                                                                                                 |
| `src/client.js`                   | Axios instance with Keycloak token interceptor and 401 refresh logic. Triggers `forceRefetchAll` on mutations.                                                                        |
| `src/cache.js`                    | Apollo `InMemoryCache` + reactive variables (filters, counters, date range, inactive mode). Custom `merge` policy for paginated `jobsAggregated`.                                     |
| `src/graphql/usePolling.js`       | Central polling manager. Registers/unregisters queries, handles inactivity pause/resume.                                                                                              |
| `src/graphql/useApolloClient.jsx` | Creates Apollo client per-render with error link (error counting → Grafana notification).                                                                                             |
| `src/graphql/queries/`            | All GQL query definitions: jobs, algorithms, pipelines, discovery, counters, workers, drivers, queue, data sources, error logs, node statistics.                                      |
| `src/middleware/`                 | Redux middleware: `restMiddleware` (API calls), `restConfigMiddleware` (config fetch), `messagesMiddleware` (toast display).                                                          |
| `src/actions/`                    | Redux action creators for all entities and operations (CRUD, run, stop, cron, build, etc.).                                                                                           |
| `src/reducers/`                   | Redux slices: `connection`, `config`, `jobs`, `algorithms`, `pipelines`, `workers`, `drivers`, `queue`, `nodeStatistics`, `errorLogs`, `experiments`, `dataSources`, `settings`, etc. |
| `src/hooks/`                      | Reusable hooks: `useActions` (dispatch wrapper), `usePolling`, `useFilters`, `useDrawer`, `useVersions`, `useTraceData`, `useWizard`, etc.                                            |
| `src/hooks/graphql/`              | GraphQL-specific hooks: `useCounters`, `useDiscovery`, `useJobsGrid`, `useDrivers`, `useWorkers`, `useAlgorithmByName`, etc.                                                          |
| `src/Routes/`                     | Page layout: `SidebarLeft` (navigation), `Header`, `Tables/` (entity pages), `SidebarRight/` (drawers for add/edit forms and monitoring panels).                                      |
| `src/Routes/Tables/`              | Entity pages: `Jobs`, `Algorithms`, `Pipelines`, `Workers`, `Drivers`, `QueueOrderJobsV2`, `DataSources`.                                                                             |
| `src/Routes/SidebarRight/`        | Drawer panels: `AddAlgorithm`, `AddPipeline`, `RunRawPipeline`, `AddDataSource`, `ErrorLogs`, `MemoryAndStorage`, CPU/GPU monitors.                                                   |
| `src/components/common/`          | Shared UI: `HKGrid` (AG Grid wrapper), `Card`, `LogsViewer`, `Json`, `Markdown`, `Tabs`, `FiltersInput`, `Form`, etc.                                                                 |
| `src/const/`                      | Constants: action types, sidebar names, drawer config, service names, local storage keys, theme names.                                                                                |
| `src/keycloak/`                   | Keycloak integration: init, login, token refresh, role checks.                                                                                                                        |

---

### What a New Developer Must Understand in the First 10–15 Minutes

1. **The app is a dashboard, not the compute engine.** All heavy processing is done by HKube backend services. This repo is purely the frontend.

2. **Two data layers coexist.** Redux (actions + middleware + reducers) handles configuration, connection state, and write operations. Apollo Client + GraphQL does the heavy lifting for read/polling. Expect to work with both.

3. **Polling is the update mechanism.** There is no WebSocket/SSE in the current active code path. Data freshness comes from Apollo `startPolling()` at 2–3 second intervals, managed by `usePolling.js`.

4. **Inactivity detection pauses polling.** After configurable idle time (default: 5 min), all queries stop. This is critical for reducing backend load.

5. **Mutations go through Redux middleware.** Dispatch a `REST_REQ_POST` / `REST_REQ_DELETE` etc. action → `restMiddleware` calls axios → on success emits `_SUCCESS` action + calls `forceRefetchAll()` to update GraphQL caches immediately.

6. **Configuration is environment-driven.** All backend URLs, feature flags (Keycloak, data sources), and monitoring URLs (Grafana, Kibana) come from environment variables, built into `dashboard-config.json` at runtime.

7. **AG Grid is the table engine.** The Jobs table and other large tables use AG Grid (Community), not Ant Design tables.

8. **Hash-sum de-duplication.** Reducers use `hash-sum` to compare incoming data with current state, preventing unnecessary renders when polled data hasn't changed.

---

## Part 2: Non-Negotiables

### Hard Constraints

- **Backend API contract must be respected.** The dashboard assumes the HKube API Server exposes REST endpoints at `/api/v1/...` and a GraphQL endpoint at `{backendApiUrl}/graphql`. Any backend schema change will silently break queries.
- **`dashboard-config.json` must be available at startup.** The entire app gates rendering on `hasConfig: true`. If this endpoint fails, nothing renders.
- **Environment variables drive production configuration.** There is no hardcoded fallback for backend hosts/ports in production. If `API_SERVER_BACKEND_HOST` is not set, the Express server won't proxy correctly.

### Performance Expectations

- **Polling intervals are tuned to 2–3 seconds.** Increasing frequency risks overloading the API server. Decreasing frequency degrades perceived responsiveness. Any change must be benchmarked against backend capacity.
- **Hash-sum comparisons in reducers must remain.** These prevent Redux state updates (and cascading re-renders) when polled data is identical. Removing them will cause continuous rerendering of the entire component tree on every poll cycle.
- **`forceRefetchAll()` is called after every write mutation.** This ensures the UI reflects the latest state immediately after user actions. Removing or debouncing this will create stale-data bugs.
- **The inactivity system must not be disabled.** It prevents idle browser tabs from continuously polling the backend — critical when many users have the dashboard open.
- **AG Grid is used for large tables (Jobs).** Ant Design tables are not suitable for the job list which can contain thousands of entries with virtual scrolling. Do not replace AG Grid with Ant Table for high-volume views.
- **Apollo cache `merge` policy for `jobsAggregated` handles pagination and counter tracking.** Modifying the cache merge logic without understanding the `limit` threshold constants (100000 for total count, 200000 for active count, < 100000 for scroll pagination) will break job counting and infinite scroll.

### Data Handling Rules

- **Job data is cursor-paginated.** The jobs table fetches in batches (default: 100) and supports infinite scroll via `onFetchMore`. The cursor mechanism must be preserved.
- **Reactive variables (`makeVar`) drive cross-component filter state.** `instanceFiltersVar`, `instanceCounterVar`, `dateTimeDefaultVar`, and `metaVar` are the source of truth for filter/counter state shared between the sidebar, header counters, and table views. These must remain reactive variables (not Redux state) because they're consumed directly in Apollo query variables.
- **Date ranges use timezone-aware ISO strings.** The `getDateTimeZoneString` utility accounts for local timezone offset. Always use it when constructing date range parameters.
- **Experiment filtering is global.** The `metaVar.experimentName` reactive variable is used in nearly every data query. Changing experiment scoping logic affects all entity views.

### UX Requirements for Dashboards

- **The app must render within 2 seconds of config load** (`setTimeout(() => setIsDataAvailable(true), 2000)` in `Routes/index.jsx`). The loading screen is shown during this window.
- **Toast messages must confirm every user action.** Success and error messages are driven by `messagesMiddleware` + `success-messages.schema`. Every REST mutation must produce user feedback.
- **Error thresholds trigger modal alerts.** If GraphQL errors exceed 20 in 60 seconds, a modal directs users to Grafana. This threshold (`MAX_ERRORS_THRESHOLD = 20`, `TIME_INTERVAL = 60000`) must not be loosened without ops team approval.
- **Max 3 concurrent toast messages** (`message.config({ maxCount: 3 })`). More than 3 causes visual clutter.
- **Keycloak auth gates destructive actions.** When `keycloakEnable` is true, the Keycloak token is injected in every request and specific UI elements (e.g., audit trail columns) are conditionally shown. Auth bypass must never be introduced.
- **401 responses trigger a single automatic token refresh.** The axios interceptor retries once with a refreshed token. If refresh fails, the user is logged out. Do not add retry loops.

### Things That Must NEVER Be Violated

1. **Never remove the inactivity polling pause.** Idle tabs will DDoS the backend.
2. **Never change cache `merge` policies without understanding the limit-based branching.** The `100000` / `200000` limits are sentinel values distinguishing counter-queries from paginated-queries.
3. **Never bypass Keycloak token injection when `keycloakEnable` is true.** All API calls must carry the auth token.
4. **Never make GraphQL queries without registering them in `usePolling`.** Unregistered queries won't participate in inactivity pausing and will continue polling indefinitely in background tabs.
5. **Never hardcode backend URLs.** All connectivity is environment-driven through `dashboard-config.json`.
6. **Never remove `forceRefetchAll` calls after mutations.** Users will see stale data until the next poll cycle (up to 3 seconds), creating a perception of broken functionality.
7. **Never replace AG Grid with Ant Table for the jobs view.** The jobs table regularly handles 1000+ rows with virtual scrolling; Ant Table does not support this performantly.

---

### Assumptions Made During Analysis

- The `SOCKET_GET_DATA` action type in reducers appears to be a legacy path from when the app used WebSocket (socket.io) for real-time data. The socket middleware (`socketMiddleware`) is commented out in `store.js`. It is unclear whether `SOCKET_GET_DATA` is still dispatched through any active code path, or if the reducers are effectively dead code waiting to be cleaned up. **Assumption: these reducers are retained for backward compatibility or a future re-enablement of socket-based streaming.**
- The `board` configuration (TensorBoard integration) appears to be a secondary feature. Its active usage status is unclear from the codebase alone.
- The `inactiveCheckMs` default of 300,000 ms (5 minutes) is the production value. It can be overridden via environment variable `VITE_INACTIVE_CHECK_MS`.
