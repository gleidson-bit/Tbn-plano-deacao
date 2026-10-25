// Reserva caso o navegador não consiga ler o TSE direto: a Vercel busca e repassa.
export default async function handler(req, res) {
  const eleicao = String(req.query.eleicao || "6258").replace(/\D/g, "");
  const cod = eleicao.padStart(6, "0");
  const url = `https://resultados.tse.jus.br/oficial/ele2026/${eleicao}/dados/br/br-c0001-e${cod}-u.json`;
  try {
    const r = await fetch(url, { cache: "no-store" });
    res.setHeader("Cache-Control", "s-maxage=10, stale-while-revalidate=20");
    res.status(r.status).setHeader("Content-Type", "application/json").send(await r.text());
  } catch (e) {
    res.status(502).json({ erro: "Não foi possível falar com o TSE." });
  }
}
