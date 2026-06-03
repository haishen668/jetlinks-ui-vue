# LSX UI 2.1.1 Recovery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Recover a maintainable JetLinks UI source tree for the customized old `lsx-device` 2.1.1 backend without modifying the known-good production jar.

**Architecture:** Use official `jetlinks-ui-vue` branch `2.1` as the source baseline, then reconstruct only the customized LSX frontend modules proven by the compiled `html/assets` bundle and the restored backend controllers. Keep the existing local `2.11` workspace untouched; all work happens in `F:\project\other\jetlinks\jetlinks-ui-vue-2.1.1` on branch `lsx-ui-2.1.1-recovery`.

**Tech Stack:** Vue 3.2, Vite 4, Ant Design Vue 3, TypeScript, JetLinks 2.1 UI conventions, MySQL-backed old LSX backend.

---

## Baseline Decision

Use official branch `2.1` at commit `abd8a056d065ea8c4a087f4aeaf816ef1c40be9f`.

Reasons:

- The backend being restored is old JetLinks 2.1.1, not 2.11.
- The compiled frontend assets under `F:\project\other\jetlinks\html` expose many original source paths matching a JetLinks 2.x Vue project.
- Local `F:\project\other\jetlinks\jetlinks-ui-vue` is branch `2.11` and has unrelated dirty changes. It must not be used for this recovery branch.
- Official `2.1` uses the expected old stack: Vue `3.2.45`, Vite `^4.0.0`, Ant Design Vue `^3.2.15`, and Node `18.14.0`.

## Evidence

Compiled frontend:

- Built frontend root: `F:\project\other\jetlinks\html`
- Important compiled bundle: `F:\project\other\jetlinks\html\assets\system.1753375679050.js`
- No standalone `.map` source-map files were found, so exact one-to-one source restoration is not possible.
- The compiled bundle still preserves many original source path strings. Extraction found 456 view-like paths and 210 customization-relevant paths.

High-confidence customized frontend paths found in compiled assets:

- `src/views/customer/index.vue`
- `src/views/customer/components/EditDialog.vue`
- `src/views/customer/DashBoard/index.vue`
- `src/views/customer/DashBoard/components/Amap.vue`
- `src/views/customer/DashBoard/components/Charts.vue`
- `src/views/customer/DashBoard/components/Guide.vue`
- `src/views/customer/DashBoard/components/NewCard.vue`
- `src/views/customer/DashBoard/components/TimeSelect.vue`
- `src/views/customer/DashBoard/components/TopCard.vue`
- `src/views/customer/Device/index.vue`
- `src/views/customer/Device/Import/index.vue`
- `src/views/customer/Device/ModifyUser/index.vue`
- `src/views/customer/Device/PingConfig/index.vue`
- `src/views/customer/Device/Process/index.vue`
- `src/views/customer/Device/Save/index.vue`
- `src/views/customer/Device/Detail/index.vue`
- `src/views/customer/Device/Detail/Info/index.vue`
- `src/views/customer/Device/Detail/DeviceAmap.vue`
- `src/views/customer/Device/Detail/Job/index.vue`
- `src/views/customer/Device/Detail/Job/Save/index.vue`
- `src/views/customer/Device/Detail/Job/Timer/index.vue`
- `src/views/customer/Device/Detail/Job/Timer/WhenOption.vue`
- `src/views/customer/Device/Detail/Job/FunctionCall/index.vue`
- `src/views/customer/Device/Detail/Job/Log/index.vue`
- `src/views/customer/Device/Detail/Running/index.vue`
- `src/views/customer/Device/Detail/Running/Property/index.vue`
- `src/views/customer/Device/Detail/Running/Property/Table.vue`
- `src/views/customer/Device/Detail/Running/Property/Chart.vue`
- `src/views/customer/Device/Detail/Running/Property/Charts.vue`
- `src/views/customer/Device/Detail/Running/Property/TimeComponent.vue`
- `src/views/customer/Device/Detail/Running/Property/ValueDetail.vue`
- `src/views/customer/Device/Detail/Running/Property/ValueRender.vue`
- `src/views/device/Instance/Detail/Job/index.vue`
- `src/views/device/Instance/Detail/Job/Save/index.vue`
- `src/views/device/Instance/Detail/Job/Timer/index.vue`
- `src/views/device/Instance/Detail/Job/Timer/WhenOption.vue`
- `src/views/device/Instance/Detail/Job/FunctionCall/index.vue`
- `src/views/device/Instance/Detail/Job/Log/index.vue`
- `src/views/iot-card/CardManagement/...`
- `src/views/rule-engine/Alarm/...`
- `src/views/rule-engine/Scene/...`

Official `2.1` source comparison:

- `src/views/customer` does not exist in official `2.1`; this is the first restoration target.
- `src/views/device/Instance` exists, but `src/views/device/Instance/Detail/Job` does not exist; this should be restored because the backend has a matching custom `DeviceJobController`.
- `src/views/iot-card`, `src/views/rule-engine/Alarm`, and `src/views/rule-engine/Scene` exist in official `2.1`; restore these later only where compiled evidence or backend deltas prove customization.

Backend custom endpoints to support:

- `POST /customer/_create`
- `PUT /customer/{userId}/_update`
- `GET /customer/{userId}`
- `POST /customer/_query`
- `POST /customer/no-paging/_query`
- `GET /customer`
- `PUT /customer`
- `POST /customer/device/_query`
- `POST /customer/device/queryPosition`
- `GET /customer/device/getLocation`
- `GET /customer/device/syncState`
- `GET /customer/device/deployAll`
- `POST /customer/device/_update`
- `PATCH /customer/device/_add`
- `PATCH /customer/device/batchUpdate`
- `POST /customer/device/_count`
- `GET /customer/device/{productId}/import`
- `GET /customer/device/{productId}/template.{format}`
- `GET /customer/device/export.{format}`
- `POST /deviceJob/{deviceId}/_query`
- `POST /deviceJob`
- `PUT /deviceJob/{id}`
- `PUT /deviceJob/{id}/_disable`
- `PUT /deviceJob/{id}/_enable`
- `DELETE /deviceJob/{id}`
- `POST /deviceJob/{id}/execute/_query`

## Files To Create First

- `src/api/customer.ts`: typed request wrappers for `/customer`.
- `src/api/customerDevice.ts`: typed request wrappers for `/customer/device`.
- `src/api/deviceJob.ts`: typed request wrappers for `/deviceJob`.
- `src/views/customer/index.vue`: customer list entry page.
- `src/views/customer/components/EditDialog.vue`: customer create/edit modal.
- `src/views/customer/DashBoard/index.vue`: customer dashboard entry.
- `src/views/customer/DashBoard/components/*.vue`: dashboard widgets shown by compiled bundle paths.
- `src/views/customer/Device/index.vue`: customer device list.
- `src/views/customer/Device/Detail/index.vue`: customer device detail shell.
- `src/views/customer/Device/Detail/Info/index.vue`: customer device info tab.
- `src/views/customer/Device/Detail/Job/**/*.vue`: customer device job pages.
- `src/views/device/Instance/Detail/Job/**/*.vue`: shared or normal device job pages.

## Files To Compare Before Editing

- `src/api/comm.ts`: confirms the 2.1 request wrapper style.
- `src/views/device/Instance/index.vue`: source pattern for device list pages.
- `src/views/device/Instance/Detail/index.vue`: source pattern for device detail tabs.
- `src/views/device/Instance/Save/index.vue`: source pattern for create/edit forms.
- `src/views/rule-engine/Alarm/**`: compare with compiled bundle before changing.
- `src/views/rule-engine/Scene/**`: compare with compiled bundle before changing.
- `src/views/iot-card/CardManagement/**`: compare with compiled bundle before changing.

## Task 1: Commit Recovery Plan

**Files:**

- Create: `docs/reconstruction/lsx-ui-2.1.1-recovery-plan.md`

- [x] **Step 1: Review worktree status**

Run:

```powershell
git -C F:\project\other\jetlinks\jetlinks-ui-vue-2.1.1 status --short --branch
```

Expected:

```text
## lsx-ui-2.1.1-recovery
?? docs/
```

- [x] **Step 2: Commit the plan**

Run:

```powershell
git -C F:\project\other\jetlinks\jetlinks-ui-vue-2.1.1 add docs/reconstruction/lsx-ui-2.1.1-recovery-plan.md
git -C F:\project\other\jetlinks\jetlinks-ui-vue-2.1.1 commit -m "docs: plan lsx ui 2.1.1 recovery"
```

Expected: a new commit on `lsx-ui-2.1.1-recovery`.

Actual: committed as `40ae9959 docs: plan lsx ui 2.1.1 recovery`.

- [x] **Step 3: Push the branch**

Run:

```powershell
git -C F:\project\other\jetlinks\jetlinks-ui-vue-2.1.1 push -u origin lsx-ui-2.1.1-recovery
```

Expected: branch exists in the private GitHub remote configured as `origin`.

Actual: pushed to `origin/lsx-ui-2.1.1-recovery`.

## Task 2: Restore API Wrappers

**Files:**

- Create: `src/api/customer.ts`
- Create: `src/api/customerDevice.ts`
- Create: `src/api/deviceJob.ts`

- [x] **Step 1: Inspect existing API style**

Run:

```powershell
Get-Content -Path F:\project\other\jetlinks\jetlinks-ui-vue-2.1.1\src\api\comm.ts -TotalCount 120
```

Expected: API functions import `server from '@/utils/request'` and return `server.get`, `server.post`, `server.put`, `server.patch`, or `server.remove`.

- [x] **Step 2: Create customer API**

Create `src/api/customer.ts` with wrappers for:

```text
POST /customer/_create
PUT /customer/{userId}/_update
GET /customer/{userId}
POST /customer/_query
POST /customer/no-paging/_query
GET /customer
PUT /customer
```

- [x] **Step 3: Create customer device API**

Create `src/api/customerDevice.ts` with wrappers for:

```text
POST /customer/device/_query
POST /customer/device/queryPosition
GET /customer/device/getLocation
GET /customer/device/syncState
GET /customer/device/deployAll
POST /customer/device/_update
PATCH /customer/device/_add
PATCH /customer/device/batchUpdate
POST /customer/device/_count
GET /customer/device/{productId}/import
GET /customer/device/{productId}/template.{format}
GET /customer/device/export.{format}
```

- [x] **Step 4: Create device job API**

Create `src/api/deviceJob.ts` with wrappers for:

```text
POST /deviceJob/{deviceId}/_query
POST /deviceJob
PUT /deviceJob/{id}
PUT /deviceJob/{id}/_disable
PUT /deviceJob/{id}/_enable
DELETE /deviceJob/{id}
POST /deviceJob/{id}/execute/_query
```

- [x] **Step 5: Type-check import paths**

Run:

```powershell
git -C F:\project\other\jetlinks\jetlinks-ui-vue-2.1.1 diff -- src/api
```

Expected: only the three new API files are shown.

Actual: committed as `86169dd1 feat: add lsx backend api wrappers` and pushed to `origin/lsx-ui-2.1.1-recovery`.

## Task 3: Restore Customer List And Edit Dialog

**Files:**

- Create: `src/views/customer/index.vue`
- Create: `src/views/customer/components/EditDialog.vue`

- [ ] **Step 1: Reuse list conventions from device instance page**

Read:

```powershell
Get-Content -Path F:\project\other\jetlinks\jetlinks-ui-vue-2.1.1\src\views\device\Instance\index.vue -TotalCount 260
```

Expected: identify the page table, query, save/edit action, delete/action column, and permission helpers used by JetLinks 2.1 UI.

- [ ] **Step 2: Implement customer table**

Create a customer page that calls:

```text
queryCustomer(params) -> POST /customer/_query
createCustomer(data) -> POST /customer/_create
updateCustomer(userId, data) -> PUT /customer/{userId}/_update
getCustomer(userId) -> GET /customer/{userId}
```

Minimum visible columns:

```text
name
username
telephone
email
createTime
actions
```

- [ ] **Step 3: Implement edit dialog**

Create a modal form with fields:

```text
name
username
password
telephone
email
description
```

Rules:

```text
name: required
username: required on create
password: required on create, optional on edit
telephone: optional
email: optional
```

- [ ] **Step 4: Build-check the slice**

Run:

```powershell
npm --prefix F:\project\other\jetlinks\jetlinks-ui-vue-2.1.1 run build
```

Expected: TypeScript and Vite complete without unresolved import errors from the new customer page.

## Task 4: Restore Customer Device Pages

**Files:**

- Create: `src/views/customer/Device/index.vue`
- Create: `src/views/customer/Device/Save/index.vue`
- Create: `src/views/customer/Device/Import/index.vue`
- Create: `src/views/customer/Device/ModifyUser/index.vue`
- Create: `src/views/customer/Device/PingConfig/index.vue`
- Create: `src/views/customer/Device/Process/index.vue`

- [ ] **Step 1: Copy behavior from official device pages**

Read the official 2.1 device pages before implementation:

```powershell
Get-ChildItem -Path F:\project\other\jetlinks\jetlinks-ui-vue-2.1.1\src\views\device\Instance -Recurse -Filter *.vue | Select-Object FullName
```

Expected: identify matching list, save, import, and process components to adapt.

- [ ] **Step 2: Route customer device list to custom backend API**

Use `src/api/customerDevice.ts` for list, update, add, batch update, count, import, template, and export operations.

- [ ] **Step 3: Preserve route names from compiled bundle**

Use directory and file names exactly as extracted from compiled assets:

```text
customer/Device/index.vue
customer/Device/Save/index.vue
customer/Device/Import/index.vue
customer/Device/ModifyUser/index.vue
customer/Device/PingConfig/index.vue
customer/Device/Process/index.vue
```

- [ ] **Step 4: Build-check the slice**

Run:

```powershell
npm --prefix F:\project\other\jetlinks\jetlinks-ui-vue-2.1.1 run build
```

Expected: build succeeds and generated chunks include customer device routes.

## Task 5: Restore Device Job Pages

**Files:**

- Create: `src/views/device/Instance/Detail/Job/index.vue`
- Create: `src/views/device/Instance/Detail/Job/Save/index.vue`
- Create: `src/views/device/Instance/Detail/Job/Timer/index.vue`
- Create: `src/views/device/Instance/Detail/Job/Timer/WhenOption.vue`
- Create: `src/views/device/Instance/Detail/Job/FunctionCall/index.vue`
- Create: `src/views/device/Instance/Detail/Job/Log/index.vue`
- Create: matching files under `src/views/customer/Device/Detail/Job/` if customer detail uses a separate copy.

- [ ] **Step 1: Implement list and action API binding**

Use `src/api/deviceJob.ts` for:

```text
query jobs
create job
update job
enable job
disable job
delete job
query execution records
```

- [ ] **Step 2: Wire job page into device detail tabs**

Inspect:

```powershell
Get-Content -Path F:\project\other\jetlinks\jetlinks-ui-vue-2.1.1\src\views\device\Instance\Detail\index.vue -TotalCount 260
```

Add the job tab using the same tab registration pattern already used by the page.

- [ ] **Step 3: Build-check the slice**

Run:

```powershell
npm --prefix F:\project\other\jetlinks\jetlinks-ui-vue-2.1.1 run build
```

Expected: build succeeds with no unresolved `Job` route imports.

## Task 6: Compare Existing 2.1 Modules With Compiled Custom Assets

**Files:**

- Modify only if proven necessary: `src/views/iot-card/CardManagement/**`
- Modify only if proven necessary: `src/views/rule-engine/Alarm/**`
- Modify only if proven necessary: `src/views/rule-engine/Scene/**`

- [ ] **Step 1: Extract compiled route path references**

Run:

```powershell
rg "src/views/(iot-card|rule-engine)" F:\project\other\jetlinks\html\assets -n
```

Expected: route path strings are visible in compiled JavaScript.

- [ ] **Step 2: Compare official source with compiled module names**

Run:

```powershell
Get-ChildItem -Path F:\project\other\jetlinks\jetlinks-ui-vue-2.1.1\src\views\iot-card,F:\project\other\jetlinks\jetlinks-ui-vue-2.1.1\src\views\rule-engine -Recurse -Filter *.vue | Select-Object FullName
```

Expected: most official files already exist. Only files absent from official 2.1 or behavior tied to restored backend custom endpoints should be changed.

- [ ] **Step 3: Build-check after each proven change**

Run:

```powershell
npm --prefix F:\project\other\jetlinks\jetlinks-ui-vue-2.1.1 run build
```

Expected: build succeeds after every small restoration batch.

## Verification Commands

Use these commands after each restoration slice:

```powershell
git -C F:\project\other\jetlinks\jetlinks-ui-vue-2.1.1 status --short --branch
npm --prefix F:\project\other\jetlinks\jetlinks-ui-vue-2.1.1 run build
```

If dependencies are missing:

```powershell
npm --prefix F:\project\other\jetlinks\jetlinks-ui-vue-2.1.1 install
npm --prefix F:\project\other\jetlinks\jetlinks-ui-vue-2.1.1 run build
```

Observed dependency note:

```powershell
npm install --legacy-peer-deps --ignore-scripts --package-lock=false --no-audit --no-fund
npm install vue3-json-viewer@2.2.2 --no-save --legacy-peer-deps --ignore-scripts --package-lock=false --no-audit --no-fund
npm run build
```

This succeeds locally. Without the `vue3-json-viewer@2.2.2` local pin, npm installs `2.4.1`, which no longer contains `dist/index.css`; official 2.1 source imports that old CSS path.

Expected final state:

- The source tree builds from the recovered 2.1 baseline.
- Customer pages exist in source and route/chunk names align with compiled `html`.
- Device job pages exist and call the restored `/deviceJob` backend.
- Existing official `iot-card`, `Alarm`, and `Scene` modules remain unchanged unless there is direct evidence they were customized.
- The old production jar remains untouched.

## Recovery Risks

- There are no `.map` files in `html`, so exact original variable names, comments, and component layout cannot be recovered automatically.
- The compiled bundle gives strong evidence for routes, component boundaries, and API usage, but templates may need reconstruction from official 2.1 analogs plus runtime testing.
- Some customer pages may be backend-specific and require smoke testing against the restored old backend with profile `wj`.
