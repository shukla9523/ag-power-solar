"use client"

import { useRouter } from "next/navigation"
import CaseStudyEditor from "../_components/CaseStudyEditor"

export default function NewCaseStudyPage() {
  const router = useRouter()

  return (
    <div className="relative w-full">
      <CaseStudyEditor
        onClose={() => router.push("/admin/case-studies")}
        onSaveSuccess={() => router.push("/admin/case-studies")}
      />
    </div>
  )
}
