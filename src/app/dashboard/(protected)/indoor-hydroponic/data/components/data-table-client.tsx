"use client";

import { useState, useEffect } from "react";
import type { LogData } from "../page";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar, Download, LoaderCircle, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { downloadData, getFilteredData } from "../actions";
import Papa from "papaparse";

type DataTableProps = {
  initialData: LogData[];
  totalCount: number;
};

export function DataTableClient({ initialData, totalCount }: DataTableProps) {
  const [data, setData] = useState<LogData[]>(initialData);
  const [totalRows, setTotalRows] = useState(totalCount);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const [pageInput, setPageInput] = useState(String(currentPage));

  const totalPages = Math.ceil(totalRows / rowsPerPage);

  useEffect(() => {
    setPageInput(String(currentPage));
  }, [currentPage]);

  const fetchData = async (page = currentPage, limit = rowsPerPage) => {
    setIsLoading(true);
    const result = await getFilteredData({
      startDate: startDate?.toISOString(),
      endDate: endDate?.toISOString(),
      page,
      limit,
    });
    if (result.data && !result.error) {
      setData(result.data);
      setTotalRows(result.count);
      setCurrentPage(page);
    } else {
      alert("Gagal memuat data: " + result.error);
    }
    setIsLoading(false);
  };
  
  const handleFilterClick = () => {
    fetchData(1, rowsPerPage);
  };

  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLimit = Number(e.target.value);
    setRowsPerPage(newLimit);
    fetchData(1, newLimit);
  };
  
  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPageInput(e.target.value);
  };

  const handlePageInputSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const pageNumber = parseInt(pageInput, 10);
      if (pageNumber && pageNumber > 0 && pageNumber <= totalPages) {
        fetchData(pageNumber);
      } else {
        setPageInput(String(currentPage));
      }
    }
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    const start = startDate ? startDate.toISOString() : '';
    const end = endDate ? endDate.toISOString() : '';
    const result = await downloadData(start, end);

    if (result.error) {
      alert(result.error);
    } else if (result.data) {
      const formattedData = result.data.map(log => ({
        ...log,
        created_at: new Date(log.created_at).toLocaleString('id-ID', {
          year: 'numeric', month: '2-digit', day: '2-digit',
          hour: '2-digit', minute: '2-digit', second: '2-digit',
          hour12: false
        })
      }));
      const csv = Papa.unparse(formattedData);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const fileName = `data_indoor_hydroponic_${new Date().toISOString().split('T')[0]}.csv`;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    setIsDownloading(false);
  };
  
  return (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow-md border">
      {/* Filter & Tombol Aksi */}
      <div className="flex flex-col md:flex-row gap-4 mb-4 items-center">
        <div className="flex items-center gap-2 flex-grow">
          <Calendar className="h-5 w-5 text-gray-500" />
          {/* PERBAIKAN: Menambahkan prop yang benar untuk rentang tanggal */}
          <DatePicker 
            selected={startDate} 
            onChange={(date) => setStartDate(date)} 
            selectsStart
            startDate={startDate}
            endDate={endDate}
            placeholderText="Tanggal Mulai" 
            className="w-full border rounded-lg px-3 py-2" 
          />
          <DatePicker 
            selected={endDate} 
            onChange={(date) => setEndDate(date)} 
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate ?? undefined} 
            placeholderText="Tanggal Selesai" 
            className="w-full border rounded-lg px-3 py-2" 
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button onClick={handleFilterClick} disabled={isLoading} className="w-full md:w-auto flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-blue-400">
            <Filter size={18} /> <span>Terapkan</span>
          </button>
          <button onClick={handleDownload} disabled={isDownloading} className="w-full md:w-auto flex items-center justify-center gap-2 bg-green-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700 disabled:bg-green-400">
            {isDownloading ? <LoaderCircle className="animate-spin" /> : <Download size={18} />} <span>Unduh CSV</span>
          </button>
        </div>
      </div>

      <div className={`overflow-x-auto relative ${isLoading ? 'opacity-50' : ''}`}>
        {isLoading && <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50 z-10"><LoaderCircle className="animate-spin h-8 w-8 text-blue-600" /></div>}
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">EC</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TDS</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">pH</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Suhu Air</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Suhu Ruang</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Humid.</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TVOC</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CO2</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((log) => (
              <tr key={log.id}>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-800">{new Date(log.created_at).toLocaleString('id-ID')}</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{log.ec}</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{log.tds}</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{log.ph}</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{log.water_temp}</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{log.room_temp}</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{log.humidity}</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{log.tvoc}</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{log.co2}</td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr><td colSpan={9} className="text-center py-10 text-gray-500">Tidak ada data yang ditemukan.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Kontrol Paginasi */}
      <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <span>Baris per halaman:</span>
          <select value={rowsPerPage} onChange={handleRowsPerPageChange} className="border rounded-lg px-2 py-1">
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
        <div className="flex items-center gap-4">
          <span>
            Halaman{' '}
            <input
              type="number"
              value={pageInput}
              onChange={handlePageInputChange}
              onKeyDown={handlePageInputSubmit}
              className="w-14 text-center border rounded-md p-1"
              disabled={isLoading}
            />
            {' '}dari {totalPages}
          </span>
          <div className="flex gap-1">
            <button onClick={() => fetchData(currentPage - 1)} disabled={currentPage <= 1 || isLoading} className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50"><ChevronLeft size={16} /></button>
            <button onClick={() => fetchData(currentPage + 1)} disabled={currentPage >= totalPages || isLoading} className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50"><ChevronRight size={16} /></button>
          </div>
        </div>
      </div>
    </div>
  );
}

