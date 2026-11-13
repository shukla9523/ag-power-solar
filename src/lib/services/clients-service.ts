/**
 * Purpose: Clients management service for the Mommantum Administration panel.
 * Stores and manages client records with resilient storage (Supabase with local fallback).
 */

import "server-only"
import fs from "fs"
import path from "path"
import { supabaseAdmin } from "@lib/supabase-admin"

export interface Client {
  id: string
  name: string
  company: string
  email: string
  phone?: string | null
  service: string
  status: "active" | "onboarding" | "review" | "completed" | "lead"
  retainer: string
  website?: string | null
  notes?: string | null
  startDate: string
  createdAt: string
  updatedAt: string
}

const SEED_CLIENTS: Client[] = []

const STORE_PATH = path.join(process.cwd(), "src", "lib", "data", "clients-store.json")

function readLocalClients(): Client[] {
  try {
    if (!fs.existsSync(STORE_PATH)) {
      fs.writeFileSync(STORE_PATH, JSON.stringify(SEED_CLIENTS, null, 2), "utf8")
      return SEED_CLIENTS
    }
    const raw = fs.readFileSync(STORE_PATH, "utf8")
    const list = JSON.parse(raw)
    return Array.isArray(list) ? list : SEED_CLIENTS
  } catch {
    return SEED_CLIENTS
  }
}

function writeLocalClients(clients: Client[]): void {
  try {
    const dir = path.dirname(STORE_PATH)
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
    fs.writeFileSync(STORE_PATH, JSON.stringify(clients, null, 2), "utf8")
  } catch (err) {
    console.warn("Failed to write to local clients store:", err)
  }
}

export async function getClients(): Promise<Client[]> {
  try {
    const { data, error } = await supabaseAdmin.from("clients").select("*").order("created_at", { ascending: false })
    if (!error && Array.isArray(data) && data.length > 0) {
      return data.map((row) => ({
        id: row.id,
        name: row.name,
        company: row.company,
        email: row.email,
        phone: row.phone || null,
        service: row.service,
        status: row.status,
        retainer: row.retainer,
        website: row.website || null,
        notes: row.notes || null,
        startDate: row.start_date || row.created_at?.slice(0, 10) || new Date().toISOString().slice(0, 10),
        createdAt: row.created_at || new Date().toISOString(),
        updatedAt: row.updated_at || new Date().toISOString(),
      }))
    }
  } catch {
    // Supabase table not present, fallback cleanly
  }
  return readLocalClients()
}

export async function createClient(input: Omit<Client, "id" | "createdAt" | "updatedAt">): Promise<Client> {
  const newClient: Client = {
    ...input,
    id: `cl_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  try {
    await supabaseAdmin.from("clients").insert({
      id: newClient.id,
      name: newClient.name,
      company: newClient.company,
      email: newClient.email,
      phone: newClient.phone,
      service: newClient.service,
      status: newClient.status,
      retainer: newClient.retainer,
      website: newClient.website,
      notes: newClient.notes,
      start_date: newClient.startDate,
      created_at: newClient.createdAt,
      updated_at: newClient.updatedAt,
    })
  } catch {
    // Ignored if table not created
  }

  const current = readLocalClients()
  const updated = [newClient, ...current]
  writeLocalClients(updated)
  return newClient
}

export async function updateClient(id: string, patch: Partial<Omit<Client, "id" | "createdAt">>): Promise<Client | null> {
  const current = readLocalClients()
  const index = current.findIndex((c) => c.id === id)
  if (index === -1) return null

  const updatedClient: Client = {
    ...current[index],
    ...patch,
    updatedAt: new Date().toISOString(),
  }
  current[index] = updatedClient
  writeLocalClients(current)

  try {
    await supabaseAdmin
      .from("clients")
      .update({
        ...patch,
        updated_at: updatedClient.updatedAt,
      })
      .eq("id", id)
  } catch {
    // Safe
  }

  return updatedClient
}

export async function deleteClient(id: string): Promise<boolean> {
  const current = readLocalClients()
  const filtered = current.filter((c) => c.id !== id)
  writeLocalClients(filtered)

  try {
    await supabaseAdmin.from("clients").delete().eq("id", id)
  } catch {
    // Safe
  }

  return true
}

