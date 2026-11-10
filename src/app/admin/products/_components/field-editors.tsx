"use client"

/**
 * Purpose: form controls for the Products editor — a text/textarea field, a toggle, and list
 * editors (plain strings or objects) with add, remove and move up/down.
 */

import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react"
import { inputClass } from "../../_components/ui"
import type { FieldDef, ObjectListField, ScalarField, StringListField } from "./section-config"

type Obj = Record<string, unknown>

const labelClass = "mb-1.5 block text-[11.5px] font-bold uppercase tracking-[0.06em] text-slate-400"
const hintClass = "mt-1 text-[11.5px] text-slate-500"
const iconButton =
  "inline-flex h-8 w-8 items-center justify-center rounded-lg border border-admin-line text-slate-400 transition hover:border-brand/50 hover:text-white disabled:opacity-30"

function move<T>(list: T[], from: number, to: number): T[] {
  if (to < 0 || to >= list.length) return list
  const next = [...list]
  const [item] = next.splice(from, 1)
  next.splice(to, 0, item)
  return next
}

function ListControls({ index, length, onMove, onRemove, label }: {
  index: number
  length: number
  onMove: (to: number) => void
  onRemove: () => void
  label: string
}) {
  return (
    <div className="flex shrink-0 items-center gap-1.5">
      <button type="button" className={iconButton} onClick={() => onMove(index - 1)} disabled={index === 0} aria-label={`Move ${label} up`}>
        <ArrowUp className="h-3.5 w-3.5" />
      </button>
      <button type="button" className={iconButton} onClick={() => onMove(index + 1)} disabled={index === length - 1} aria-label={`Move ${label} down`}>
        <ArrowDown className="h-3.5 w-3.5" />
      </button>
      <button type="button" className={`${iconButton} hover:border-red-500/50 hover:text-red-300`} onClick={onRemove} aria-label={`Remove ${label}`}>
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}

function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-admin-line px-3 py-2 text-[12.5px] font-semibold text-slate-300 transition hover:border-brand/50 hover:text-white"
    >
      <Plus className="h-3.5 w-3.5" /> Add {label.toLowerCase()}
    </button>
  )
}

export function ScalarInput({ field, value, onChange, id }: {
  field: ScalarField
  value: unknown
  onChange: (value: string) => void
  id: string
}) {
  const current = typeof value === "string" ? value : ""
  return (
    <div>
      <label htmlFor={id} className={labelClass}>{field.label}</label>
      {field.kind === "textarea" ? (
        <textarea id={id} rows={3} className={`${inputClass} resize-y`} value={current} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input id={id} type="text" className={inputClass} value={current} onChange={(e) => onChange(e.target.value)} />
      )}
      {field.hint && <p className={hintClass}>{field.hint}</p>}
    </div>
  )
}

function StringListEditor({ field, value, onChange, id }: {
  field: StringListField
  value: unknown
  onChange: (value: string[]) => void
  id: string
}) {
  const items = Array.isArray(value) ? value.map((v) => (typeof v === "string" ? v : "")) : []
  return (
    <div>
      <p className={labelClass}>{field.label}</p>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <input
              aria-label={`${field.itemLabel} ${index + 1}`}
              id={`${id}-${index}`}
              type="text"
              className={inputClass}
              value={item}
              onChange={(e) => onChange(items.map((v, i) => (i === index ? e.target.value : v)))}
            />
            <ListControls
              index={index}
              length={items.length}
              label={`${field.itemLabel} ${index + 1}`}
              onMove={(to) => onChange(move(items, index, to))}
              onRemove={() => onChange(items.filter((_, i) => i !== index))}
            />
          </div>
        ))}
      </div>
      <div className="mt-3">
        <AddButton label={field.itemLabel} onClick={() => onChange([...items, ""])} />
      </div>
      {field.hint && <p className={hintClass}>{field.hint}</p>}
    </div>
  )
}

function ObjectListEditor({ field, value, onChange, id }: {
  field: ObjectListField
  value: unknown
  onChange: (value: Obj[]) => void
  id: string
}) {
  const items: Obj[] = Array.isArray(value) ? value.map((v) => (v && typeof v === "object" ? (v as Obj) : {})) : []
  const blank = (): Obj => Object.fromEntries(field.fields.map((f) => [f.key, ""]))

  return (
    <div>
      <p className={labelClass}>{field.label}</p>
      {field.hint && <p className={`${hintClass} mb-2`}>{field.hint}</p>}
      <div className="space-y-3">
        {items.map((item, index) => {
          const title = typeof item[field.titleKey] === "string" && item[field.titleKey] ? String(item[field.titleKey]) : "(empty)"
          return (
            <div key={index} className="rounded-xl border border-admin-line bg-admin-bg/40 p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="truncate text-[12.5px] font-bold text-slate-200">
                  {field.itemLabel} {index + 1} <span className="font-medium text-slate-500">· {title}</span>
                </p>
                <ListControls
                  index={index}
                  length={items.length}
                  label={`${field.itemLabel} ${index + 1}`}
                  onMove={(to) => onChange(move(items, index, to))}
                  onRemove={() => onChange(items.filter((_, i) => i !== index))}
                />
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {field.fields.map((sub) => (
                  <div key={sub.key} className={sub.kind === "textarea" ? "md:col-span-2" : undefined}>
                    <ScalarInput
                      id={`${id}-${index}-${sub.key}`}
                      field={sub}
                      value={item[sub.key]}
                      onChange={(v) => onChange(items.map((it, i) => (i === index ? { ...it, [sub.key]: v } : it)))}
                    />
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
      <div className="mt-3">
        <AddButton label={field.itemLabel} onClick={() => onChange([...items, blank()])} />
      </div>
    </div>
  )
}

export function FieldEditor({ field, value, onChange, id }: {
  field: FieldDef
  value: unknown
  onChange: (value: unknown) => void
  id: string
}) {
  switch (field.kind) {
    case "boolean":
      return (
        <label htmlFor={id} className="flex cursor-pointer items-center gap-3 text-[13px] font-semibold text-slate-200">
          <input id={id} type="checkbox" className="h-4 w-4 accent-brand" checked={value === true} onChange={(e) => onChange(e.target.checked)} />
          {field.label}
        </label>
      )
    case "stringList":
      return <StringListEditor id={id} field={field} value={value} onChange={onChange} />
    case "objectList":
      return <ObjectListEditor id={id} field={field} value={value} onChange={onChange} />
    default:
      return <ScalarInput id={id} field={field} value={value} onChange={onChange} />
  }
}
