import React, { useEffect, useMemo, useState } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, Legend } from "recharts";

const TBN_BLUE = "#004AAD";
const TBN_ORANGE = "#FF7A00";

const STATUS_OPTIONS = [
  { value: "nao_iniciado", label: "🔴 Não iniciado" },
  { value: "em_andamento", label: "🟡 Em andamento" },
  { value: "concluido", label: "🟢 Concluído" },
  { value: "atrasado", label: "🕒 Atrasado" },
];

const PRIORIDADE_OPTIONS = [
  { value: "alta", label: "Alta" },
  { value: "media", label: "Média" },
  { value: "baixa", label: "Baixa" },
];

const PIE_COLORS = [TBN_ORANGE, TBN_BLUE, "#10B981", "#9CA3AF"];

const emptyRow = (i) => ({
  id: crypto.randomUUID(),
  numero: i + 1,
  acao: "",
  responsavel: "",
  prazo: "",
  prioridade: "media",
  status: "nao_iniciado",
  observacoes: "",
});

const STORAGE_KEY = "tbn_plano_acao_v3";

export default function PlanoDeAcaoTBN() {
  const [cabecalho, setCabecalho] = useState({
    projeto: "",
    responsavel: "",
    departamento: "",
    inicio: "",
    status: "nao_iniciado",
  });

  const [linhas, setLinhas] = useState(() => Array.from({ length: 5 }, (_, i) => emptyRow(i)));
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [filtroResponsavel, setFiltroResponsavel] = useState("todos");
  const [busca, setBusca] = useState("");
  const [metas, setMetas] = useState({ targetPercent: 80, targetDate: "" });

  // Carregar do localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const data = JSON.parse(raw);
        if (data?.cabecalho) setCabecalho(data.cabecalho);
        if (Array.isArray(data?.linhas) && data.linhas.length) setLinhas(data.linhas);
        if (data?.metas) setMetas(data.metas);
      }
    } catch {}
  }, []);

  // Salvar no localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ cabecalho, linhas, metas }));
    } catch {}
  }, [cabecalho, linhas, metas]);

  const porcentagemConclusao = useMemo(() => {
    const total = linhas.length || 1;
    const concluidas = linhas.filter((l) => l.status === "concluido").length;
    return Math.round((concluidas / total) * 100);
  }, [linhas]);

  // Gráficos
  const progressoPorResponsavel = useMemo(() => {
    const map = new Map();
    linhas.forEach((l) => {
      const resp = (l.responsavel || "— Sem responsável —").trim();
      if (!map.has(resp)) map.set(resp, { total: 0, concluidas: 0 });
      const item = map.get(resp);
      item.total += 1;
      if (l.status === "concluido") item.concluidas += 1;
    });
    return Array.from(map.entries()).map(([name, v]) => ({
      name,
      percent: Math.round((v.concluidas / (v.total || 1)) * 100),
      concluidas: v.concluidas,
      total: v.total,
    }));
  }, [linhas]);

  const acoesPorStatus = useMemo(() => {
    const counts = new Map();
    linhas.forEach((l) => counts.set(l.status, (counts.get(l.status) || 0) + 1));
    return STATUS_OPTIONS.map((opt) => ({ key: opt.value, name: opt.label, value: counts.get(opt.value) || 0 })).filter((d) => d.value > 0);
  }, [linhas]);

  const acoesPorPrioridade = useMemo(() => {
    const counts = new Map();
    linhas.forEach((l) => counts.set(l.prioridade, (counts.get(l.prioridade) || 0) + 1));
    return PRIORIDADE_OPTIONS.map((opt) => ({ name: opt.label, total: counts.get(opt.value) || 0 })).filter((d) => d.total > 0);
  }, [linhas]);

  const responsaveisUnicos = useMemo(() => {
    const set = new Set(linhas.map((l) => (l.responsavel || "— Sem responsável —").trim()));
    return Array.from(set);
  }, [linhas]);

  const metaCalc = useMemo(() => {
    const target = Math.max(0, Math.min(100, Number(metas.targetPercent) || 0));
    const hoje = new Date();
    const inicio = cabecalho.inicio ? new Date(cabecalho.inicio) : null;
    const alvo = metas.targetDate ? new Date(metas.targetDate) : null;

    let totalDias = null, diasPassados = null, diasRestantes = null, targetAteHoje = null, ahead = null, requiredPerDay = null;

    if (inicio && alvo && !isNaN(inicio) && !isNaN(alvo) && alvo > inicio) {
      totalDias = Math.ceil((alvo - inicio) / (1000 * 60 * 60 * 24));
      const clampedHoje = new Date(Math.min(Math.max(hoje, inicio), alvo));
      diasPassados = Math.floor((clampedHoje - inicio) / (1000 * 60 * 60 * 24));
      diasRestantes = Math.max(0, totalDias - diasPassados);
      targetAteHoje = Math.round((diasPassados / totalDias) * target);
      ahead = porcentagemConclusao >= targetAteHoje;
      requiredPerDay = diasRestantes > 0 ? Math.max(0, (target - porcentagemConclusao) / diasRestantes) : 0;
    }

    return { target, totalDias, diasPassados, diasRestantes, targetAteHoje, ahead, requiredPerDay };
  }, [metas, cabecalho.inicio, porcentagemConclusao]);

  const linhasFiltradas = useMemo(() => {
    return linhas.filter((l) => {
      const hitBusca = [l.acao, l.responsavel, l.observacoes].join(" ").toLowerCase().includes(busca.toLowerCase());
      const hitStatus = filtroStatus === "todos" ? true : l.status === filtroStatus;
      const hitResp = filtroResponsavel === "todos" ? true : (l.responsavel || "— Sem responsável —") === filtroResponsavel;
      return hitBusca && hitStatus && hitResp;
    });
  }, [linhas, filtroStatus, filtroResponsavel, busca]);

  function atualizarLinha(id, campo, valor) {
    setLinhas((prev) => prev.map((l) => (l.id === id ? { ...l, [campo]: valor } : l)));
  }
  function adicionarLinha() { setLinhas((prev) => [...prev, emptyRow(prev.length)]); }
  function removerLinha(id) { setLinhas((prev) => prev.filter((l) => l.id !== id).map((l, idx) => ({ ...l, numero: idx + 1 }))); }
  function limparTudo() {
    if (!confirm("Tem certeza que deseja limpar todo o plano?")) return;
    setCabecalho({ projeto: "", responsavel: "", departamento: "", inicio: "", status: "nao_iniciado" });
    setLinhas(Array.from({ length: 5 }, (_, i) => emptyRow(i)));
    setMetas({ targetPercent: 80, targetDate: "" });
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
  }
  function exportarJSON() {
    const blob = new Blob([JSON.stringify({ cabecalho, linhas, metas }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `plano_acao_tbn_${new Date().toISOString().slice(0,10)}.json`; a.click();
    URL.revokeObjectURL(url);
  }
  function importarJSON(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        if (data?.cabecalho && Array.isArray(data?.linhas)) {
          setCabecalho(data.cabecalho);
          setLinhas(data.linhas);
          if (data?.metas) setMetas(data.metas);
        } else alert("Arquivo inválido");
      } catch { alert("Erro ao ler JSON"); }
    };
    reader.readAsText(file);
  }
  function imprimir() { window.print(); }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Top Bar */}
      <div className="sticky top-0 z-20 border-b bg-white/90 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-3 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl" style={{ background: TBN_BLUE }} />
            <div>
              <h1 className="text-2xl font-bold" style={{ color: TBN_BLUE }}>Plano de Ação TBN</h1>
              <p className="text-sm text-gray-500">Gestão à vista • Edição rápida • Salvamento automático</p>
            </div>
          </div>
          <div className="flex items-center gap-2 print:hidden">
            <button onClick={imprimir} className="rounded-xl px-4 py-2 font-medium bg-white border" style={{ borderColor: TBN_BLUE, color: TBN_BLUE }}>
              Imprimir / PDF
            </button>
            <button onClick={exportarJSON} className="rounded-xl px-4 py-2 font-medium text-white" style={{ background: TBN_BLUE }}>
              Exportar JSON
            </button>
            <label className="rounded-xl px-4 py-2 font-medium text-white cursor-pointer" style={{ background: TBN_ORANGE }}>
              Importar JSON
              <input onChange={importarJSON} type="file" accept="application/json" className="hidden" />
            </label>
            <button onClick={limparTudo} className="rounded-xl px-4 py-2 font-medium border text-gray-700 hover:bg-gray-100">
              Limpar
            </button>
          </div>
        </div>
      </div>

      {/* Cabeçalho */}
      <div className="mx-auto max-w-7xl px-4 py-6">
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl shadow-sm border p-4">
            <label className="text-sm font-medium text-gray-600">Projeto / Reunião</label>
            <input value={cabecalho.projeto} onChange={(e) => setCabecalho((c) => ({ ...c, projeto: e.target.value }))}
              className="mt-1 w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2" style={{ borderColor: TBN_BLUE }}
              placeholder="Ex.: Migração backbone – Bairro X" />
          </div>
          <div className="bg-white rounded-2xl shadow-sm border p-4">
            <label className="text-sm font-medium text-gray-600">Responsável principal</label>
            <input value={cabecalho.responsavel} onChange={(e) => setCabecalho((c) => ({ ...c, responsavel: e.target.value }))}
              className="mt-1 w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2" style={{ borderColor: TBN_BLUE }}
              placeholder="Ex.: Gleidson / Fabiane / Marcelo" />
          </div>
          <div className="bg-white rounded-2xl shadow-sm border p-4">
            <label className="text-sm font-medium text-gray-600">Departamento</label>
            <input value={cabecalho.departamento} onChange={(e) => setCabecalho((c) => ({ ...c, departamento: e.target.value }))}
              className="mt-1 w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2" style={{ borderColor: TBN_BLUE }}
              placeholder="Ex.: Operações / Comercial / Financeiro" />
          </div>
          <div className="bg-white rounded-2xl shadow-sm border p-4">
            <label className="text-sm font-medium text-gray-600">Data de início</label>
            <input type="date" value={cabecalho.inicio} onChange={(e) => setCabecalho((c) => ({ ...c, inicio: e.target.value }))}
              className="mt-1 w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2" style={{ borderColor: TBN_BLUE }} />
          </div>
          <div className="bg-white rounded-2xl shadow-sm border p-4 lg:col-span-2">
            <label className="text-sm font-medium text-gray-600">Status geral</label>
            <select value={cabecalho.status} onChange={(e) => setCabecalho((c) => ({ ...c, status: e.target.value }))}
              className="mt-1 w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2" style={{ borderColor: TBN_BLUE }}>
              {STATUS_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border p-4 lg:col-span-2">
            <label className="text-sm font-medium text-gray-600">% de conclusão</label>
            <div className="mt-2 h-3 w-full rounded-full bg-gray-200">
              <div className="h-3 rounded-full" style={{ width: `${porcentagemConclusao}%`, background: TBN_ORANGE }} />
            </div>
            <div className="mt-1 text-sm text-gray-600">{porcentagemConclusao}% concluído</div>
          </div>
        </section>

        {/* Filtros */}
        <section className="mt-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between print:hidden">
          <div className="flex items-center gap-3">
            <div className="bg-white rounded-2xl shadow-sm border p-3 flex items-center gap-2">
              <span className="text-sm text-gray-600">Filtrar por status:</span>
              <select value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value)}
                className="rounded-xl border px-3 py-2" style={{ borderColor: TBN_BLUE }}>
                <option value="todos">Todos</option>
                {STATUS_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border p-3 flex items-center gap-2">
              <span className="text-sm text-gray-600">Filtrar responsável:</span>
              <select value={filtroResponsavel} onChange={(e) => setFiltroResponsavel(e.target.value)}
                className="rounded-xl border px-3 py-2" style={{ borderColor: TBN_BLUE }}>
                <option value="todos">Todos</option>
                {responsaveisUnicos.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input value={busca} onChange={(e) => setBusca(e.target.value)}
              className="rounded-xl border px-3 py-2" style={{ borderColor: TBN_BLUE }} placeholder="Ação, responsável, observações..." />
          </div>
        </section>

        {/* Painel de Metas */}
        <section className="mb-6 mt-6 grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl shadow-sm border p-4 lg:col-span-2">
            <h3 className="font-semibold" style={{ color: TBN_BLUE }}>Meta do projeto</h3>
            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-gray-600">% alvo de conclusão</label>
                <input type="number" min={0} max={100} value={metas.targetPercent}
                  onChange={(e) => setMetas((m) => ({ ...m, targetPercent: Number(e.target.value) }))}
                  className="mt-1 w-full rounded-xl border px-3 py-2" style={{ borderColor: TBN_BLUE }} />
              </div>
              <div>
                <label className="text-sm text-gray-600">Data-alvo</label>
                <input type="date" value={metas.targetDate} onChange={(e) => setMetas((m) => ({ ...m, targetDate: e.target.value }))}
                  className="mt-1 w-full rounded-xl border px-3 py-2" style={{ borderColor: TBN_BLUE }} />
              </div>
            </div>
            <div className="mt-4">
              <div className="h-3 w-full rounded-full bg-gray-200">
                <div className="h-3 rounded-full" style={{ width: `${porcentagemConclusao}%`, background: TBN_ORANGE }} />
              </div>
              <div className="mt-1 text-sm text-gray-600">{porcentagemConclusao}% concluído • meta {metaCalc.target}%</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border p-4 flex flex-col justify-center">
            <div className="text-sm text-gray-600">Situação</div>
            <div className="mt-1 text-lg font-semibold" style={{ color: metaCalc.ahead ?? false ? '#10B981' : '#EF4444' }}>
              {metaCalc.ahead == null ? 'Defina início e data-alvo' : (metaCalc.ahead ? 'Dentro do ritmo' : 'Abaixo do ritmo')}
            </div>
            <div className="mt-2 text-sm text-gray-600">
              {metaCalc.targetAteHoje != null && (<span>Progresso esperado hoje: <b>{metaCalc.targetAteHoje}%</b></span>)}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border p-4">
            <div className="text-sm text-gray-600">Dias restantes</div>
            <div className="mt-1 text-2xl font-bold">{metaCalc.diasRestantes ?? '—'}</div>
            <div className="text-xs text-gray-500">(do início até a data-alvo)</div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border p-4">
            <div className="text-sm text-gray-600">Ritmo necessário</div>
            <div className="mt-1 text-2xl font-bold">{metaCalc.requiredPerDay ? metaCalc.requiredPerDay.toFixed(1) + '%/dia' : '—'}</div>
            <div className="text-xs text-gray-500">para alcançar {metaCalc.target}% até a data</div>
          </div>
        </section>

        {/* Ações */}
        <section className="mt-4 overflow-x-auto">
          <table className="w-full text-sm border-separate border-spacing-y-2">
            <thead>
              <tr>
                {["Nº","Ação / Etapa","Responsável","Prazo","Prioridade","Status","Observações",""].map((h) => (
                  <th key={h} className="text-left px-3 py-2 text-gray-600">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {linhasFiltradas.map((l) => (
                <tr key={l.id} className="bg-white shadow-sm">
                  <td className="px-3 py-2 font-semibold" style={{ color: TBN_BLUE }}>{l.numero}</td>
                  <td className="px-3 py-2 min-w-[280px]">
                    <input value={l.acao} onChange={(e) => atualizarLinha(l.id, "acao", e.target.value)}
                      className="w-full rounded-lg border px-2 py-1" style={{ borderColor: TBN_BLUE }}
                      placeholder="Descrever claramente o que será feito" />
                  </td>
                  <td className="px-3 py-2 min-w-[160px]">
                    <input value={l.responsavel} onChange={(e) => atualizarLinha(l.id, "responsavel", e.target.value)}
                      className="w-full rounded-lg border px-2 py-1" style={{ borderColor: TBN_BLUE }}
                      placeholder="Nome do responsável" />
                  </td>
                  <td className="px-3 py-2">
                    <input type="date" value={l.prazo} onChange={(e) => atualizarLinha(l.id, "prazo", e.target.value)}
                      className="w-full rounded-lg border px-2 py-1" style={{ borderColor: TBN_BLUE }} />
                  </td>
                  <td className="px-3 py-2">
                    <select value={l.prioridade} onChange={(e) => atualizarLinha(l.id, "prioridade", e.target.value)}
                      className="w-full rounded-lg border px-2 py-1" style={{ borderColor: TBN_BLUE }}>
                      {PRIORIDADE_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                  </td>
                  <td className="px-3 py-2">
                    <select value={l.status} onChange={(e) => atualizarLinha(l.id, "status", e.target.value)}
                      className="w-full rounded-lg border px-2 py-1" style={{ borderColor: TBN_BLUE }}>
                      {STATUS_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                  </td>
                  <td className="px-3 py-2 min-w-[220px]">
                    <input value={l.observacoes} onChange={(e) => atualizarLinha(l.id, "observacoes", e.target.value)}
                      className="w-full rounded-lg border px-2 py-1" style={{ borderColor: TBN_BLUE }}
                      placeholder="Gargalos, dependências, check-points..." />
                  </td>
                  <td className="px-3 py-2 text-right print:hidden">
                    <button onClick={() => removerLinha(l.id)} className="text-red-600 hover:underline">Remover</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-3">
            <button onClick={adicionarLinha} className="rounded-xl px-4 py-2 font-medium text-white" style={{ background: TBN_ORANGE }}>
              + Adicionar ação
            </button>
          </div>
        </section>

        {/* Gráficos */}
        <section className="mt-8 bg-white rounded-2xl shadow-sm border p-4">
          <h3 className="font-semibold" style={{ color: TBN_BLUE }}>Progresso por responsável</h3>
          <p className="text-sm text-gray-500 mt-1">Percentual de ações concluídas por responsável</p>
          <div className="h-72 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={progressoPorResponsavel} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                <Tooltip />
                <Bar dataKey="percent" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl shadow-sm border p-4">
            <h3 className="font-semibold" style={{ color: TBN_BLUE }}>Ações por status</h3>
            <p className="text-sm text-gray-500 mt-1">Distribuição de ações por estado atual</p>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={acoesPorStatus} dataKey="value" nameKey="name" outerRadius={90} label>
                    {acoesPorStatus.map((entry, index) => (
                      <Cell key={`slice-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border p-4">
            <h3 className="font-semibold" style={{ color: TBN_BLUE }}>Ações por prioridade</h3>
            <p className="text-sm text-gray-500 mt-1">Quantidade de ações por nível de prioridade</p>
            <div className="h-72 mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={acoesPorPrioridade} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="total" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        <section className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl shadow-sm border p-4">
            <h3 className="font-semibold" style={{ color: TBN_BLUE }}>Legenda</h3>
            <div className="mt-2 flex flex-wrap gap-3 text-sm">
              <span>✅ Concluído</span>
              <span>⚙️ Em andamento</span>
              <span>🕒 Atrasado</span>
              <span>🚀 Prioritário</span>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border p-4">
            <h3 className="font-semibold" style={{ color: TBN_BLUE }}>Dicas rápidas</h3>
            <ul className="mt-2 list-disc pl-5 text-sm text-gray-600">
              <li>Escreva ações com verbo no infinitivo: “Instalar”, “Configurar”, “Revisar”…</li>
              <li>Defina prazo realista e responsável único por ação.</li>
              <li>Faça check diário de progresso e ajuste status.</li>
              <li>Use <span className="font-medium" style={{ color: TBN_ORANGE }}>Imprimir / PDF</span> para gestão à vista na sala.</li>
            </ul>
          </div>
        </section>

        <footer className="mt-8 pb-8 text-center text-xs text-gray-500">
          TBN Telecom • Plano de Ação • {new Date().getFullYear()}
        </footer>
      </div>

      {/* Estilos para impressão */}
      <style>{`
        @media print {
          .print\\:hidden { display: none !important; }
          input, select { border: none !important; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `}</style>
    </div>
  );
}
