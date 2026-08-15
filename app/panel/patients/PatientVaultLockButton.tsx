import { LockKeyhole } from "lucide-react";
import { lockPatientVaultAction } from "./vaultActions";

export default function PatientVaultLockButton() {
  return <form action={lockPatientVaultAction}><button className="inline-flex min-h-12 items-center gap-2 rounded-2xl border border-[#D5DCCF] bg-white px-4 py-3 font-semibold text-[#2D4739] transition hover:bg-[#F8F5F0]"><LockKeyhole size={18} aria-hidden="true" />Zablokuj karty</button></form>;
}
