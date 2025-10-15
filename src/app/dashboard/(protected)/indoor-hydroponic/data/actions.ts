'use server';

import { createClient } from "@veap/lib/supabase/server";
// import Papa from "papaparse";
import type { LogData } from "./page";

type FilterOptions = {
  startDate?: string | null;
  endDate?: string | null;
  page: number;
  limit: number;
};

// --- Fungsi untuk filter dan paginasi (TIDAK ADA PERUBAHAN) ---
export async function getFilteredData(options: FilterOptions) {
  try {
    const supabase = await createClient();
    const { startDate, endDate, page, limit } = options;

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let dataQuery = supabase
      .from("logs_indoor_hydroponic")
      .select("*")
      .order("created_at", { ascending: false })
      .range(from, to);

    let countQuery = supabase
      .from("logs_indoor_hydroponic")
      .select('*', { count: 'exact', head: true });
    
    if (startDate) {
      dataQuery = dataQuery.gte('created_at', new Date(startDate).toISOString());
      countQuery = countQuery.gte('created_at', new Date(startDate).toISOString());
    }
    if (endDate) {
      const nextDay = new Date(endDate);
      nextDay.setDate(nextDay.getDate() + 1);
      dataQuery = dataQuery.lt('created_at', nextDay.toISOString());
      countQuery = countQuery.lt('created_at', nextDay.toISOString());
    }

    const { data, error: dataError } = await dataQuery;
    const { count, error: countError } = await countQuery;

    if (dataError || countError) throw dataError || countError;
    return { data, count: count ?? 0 };

  } catch (error) {
    const message = error instanceof Error ? error.message : "Terjadi kesalahan tidak diketahui";
    return { error: message, data: [], count: 0 };
  }
}

// --- FUNGSI UNTUK MENGAMBIL DATA MENTAH (BUKAN CSV) ---
export async function downloadData(startDate: string, endDate: string) {
  try {
    const supabase = await createClient();
    
    const allData: LogData[] = [];
    const CHUNK_SIZE = 1000;
    let page = 0;
    let hasMoreData = true;

    while (hasMoreData) {
      const from = page * CHUNK_SIZE;
      const to = from + CHUNK_SIZE - 1;

      let query = supabase
        .from("logs_indoor_hydroponic")
        .select("*")
        .order("created_at", { ascending: true })
        .range(from, to);

      if (startDate) {
        query = query.gte('created_at', new Date(startDate).toISOString());
      }
      if (endDate) {
         const nextDay = new Date(endDate);
         nextDay.setDate(nextDay.getDate() + 1);
         query = query.lt('created_at', nextDay.toISOString());
      }

      const { data: chunk, error } = await query;
      if (error) throw error;

      if (chunk && chunk.length > 0) {
        allData.push(...chunk);
        if (chunk.length < CHUNK_SIZE) hasMoreData = false;
        else page++;
      } else {
        hasMoreData = false;
      }
    }

    if (allData.length === 0) {
      return { error: "Tidak ada data yang ditemukan untuk rentang tanggal yang dipilih." };
    }

    // Kembalikan data mentah dalam format JSON
    return { data: allData };

  } catch (error) {
    const message = error instanceof Error ? error.message : "Terjadi kesalahan";
    return { error: `Gagal mengambil data: ${message}` };
  }
}

