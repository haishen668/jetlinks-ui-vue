# REWEB Frontend Recovery Summary

Date: 2026-06-03

## Scope

This document records the frontend recovery for LSX customer devices and the REWEB entry.

Reference source:

- compiled frontend assets under `F:\project\other\jetlinks\html`
- especially `html/assets/customerDevice.1753375679050.js`
- and customer device detail chunk `html/assets/index.vue_vue_type_style_index_0_lang.17533756790505.js`

## Evidence From Compiled Frontend

The old compiled frontend had customer modules under:

- `views/customer/DashBoard`
- `views/customer/Device`
- `views/customer/Device/Detail`
- `views/customer/Device/Detail/Info`
- `views/customer/Device/Detail/Running`
- `views/customer/Device/Detail/Job`
- `views/customer/Device/Import`
- `views/customer/Device/PingConfig`
- `views/customer/Device/Process`
- `views/customer/Device/Save`
- `views/customer/Device/ModifyUser`

The REWEB flow in the old compiled detail page:

1. reads `current.subDomain`
2. finds device metadata function `reweb`
3. fills the first input with `subDomain`
4. calls `POST /device/instance/{deviceId}/function/{functionId}`
5. after success, opens:

```text
http://{subDomain}.reweb.wugee.net.cn
```

## Recovered Frontend Changes

Files changed or added:

- `src/api/customerDevice.ts`
  - restored `executeFunctions(deviceId, functionId, data)`
- `src/views/customer/Device/Detail/Info/index.vue`
  - restored customer-device detail fields used by the old page
  - restored REWEB function execution and delayed browser open
  - restored switch-card dropdown behavior
  - restored ping_config downlink button
  - restored network/SIM/automatic-switch-card display
- `src/views/customer/Device/**`
  - restored customer device route modules by reusing the existing JetLinks 2.1 device module structure where the old source was not available
- `src/views/customer/DashBoard/**`
  - restored dashboard route modules from the corresponding device dashboard structure
- `src/views/customer/components/**`
  - restored shared metadata/inkling components required by copied detail pages

## Verification

Command run:

```powershell
pnpm.cmd run build
```

Result:

- frontend build passed
- Vite emitted only pre-existing Rollup circular chunk warnings around Metadata component re-exports
- generated files `public/js/liveplayer-lib.min.js` and `src/auto-imports.d.ts` were restored and are not part of the intended change

## Notes

The current recovery makes all known old customer-device route modules resolvable and buildable. Some non-REWEB customer modules are restored by reusing the official JetLinks device pages as source-level equivalents, because only compiled assets were available for the old LSX frontend.
