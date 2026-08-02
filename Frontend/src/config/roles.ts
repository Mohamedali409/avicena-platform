// Central role config. The Avicena API uses a DIFFERENT auth header per role,
// so the frontend keys everything off the stored role.

export type Role = "patient" | "doctor" | "admin" | "lab" | "pharmacy";

interface RoleConfig {
  /** HTTP header the API expects the token in (legacy — auth is cookie-based now) */
  authHeader: "Authorization" | "dtoken" | "atoken" | "ltoken" | "phtoken";
  /** true => value must be prefixed with "Bearer " */
  bearer: boolean;
  /** where this role lands after login */
  home: string;
  /** route-group prefix this role is allowed under */
  basePath: string;
  label: string;
}

export const ROLES: Record<Role, RoleConfig> = {
  patient:  { authHeader: "Authorization", bearer: true,  home: "/patient/dashboard",  basePath: "/patient",  label: "Patient"  },
  doctor:   { authHeader: "dtoken",        bearer: false, home: "/doctor/dashboard",   basePath: "/doctor",   label: "Doctor"   },
  admin:    { authHeader: "atoken",        bearer: false, home: "/admin/dashboard",    basePath: "/admin",    label: "Admin"    },
  lab:      { authHeader: "ltoken",        bearer: false, home: "/lab/dashboard",      basePath: "/lab",      label: "Lab"      },
  pharmacy: { authHeader: "phtoken",       bearer: false, home: "/pharmacy/dashboard", basePath: "/pharmacy", label: "Pharmacy" },
};

/** Which login endpoint to hit per role. */
export const LOGIN_ENDPOINT: Record<Role, string> = {
  patient:  "/api/auth/login",
  doctor:   "/api/auth/doctor/login",
  admin:    "/api/auth/admin/login",
  lab:      "/api/auth/lab/login",
  pharmacy: "/api/auth/login",
};
