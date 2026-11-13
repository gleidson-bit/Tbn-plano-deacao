import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { FONTE } from "../SoldaTikTok";

const LARANJA = "#F37F19";
const AZUL = "#0E2639";
const AZUL_MEDIO = "#16405E";
const BRANCO = "#FFFFFF";
const VERDE = "#2BB673";
const VERMELHO = "#E8433A";
const WHATSAPP = "(64) 99283-4153";

// Cenas (em quadros, 30 = 1 segundo)
const T = {
  gancho: 0,
  comum: 75,
  troca: 190,
  passeio: 250,
  vantagens: 430,
  final: 535,
};
export const WIFI6_CASA_DURACAO = 660;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const useMola = (atraso = 0, damping = 12) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - atraso, fps, config: { damping } });
};

const Fundo: React.FC = () => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(circle at 50% 45%, ${AZUL_MEDIO} 0%, ${AZUL} 70%)`,
    }}
  />
);

const Titulo: React.FC<{
  linhas: React.ReactNode;
  topo?: number;
  tamanho?: number;
}> = ({ linhas, topo = 170, tamanho = 84 }) => {
  const p = useMola(0, 13);
  return (
    <div
      style={{
        position: "absolute",
        top: topo,
        left: 50,
        right: 50,
        textAlign: "center",
        ...FONTE,
        color: BRANCO,
        fontSize: tamanho,
        lineHeight: 1.08,
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [40, 0])}px)`,
      }}
    >
      {linhas}
    </div>
  );
};

// ---------- Ícones ----------
const D = {
  sofa: "M21 10c-1.1 0-2 .9-2 2v3H5v-3c0-1.1-.89-2-2-2s-2 .9-2 2v5c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2v-5c0-1.1-.9-2-2-2zm-3-5H6c-1.1 0-2 .9-2 2v2.15c1.16.41 2 1.51 2 2.82V14h12v-2.03c0-1.3.84-2.4 2-2.82V7c0-1.1-.9-2-2-2z",
  cozinha:
    "M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z",
  cama: "M7 13c1.66 0 3-1.34 3-3S8.66 7 7 7s-3 1.34-3 3 1.34 3 3 3zm12-6h-8v7H3V5H1v15h2v-3h18v3h2v-9c0-2.21-1.79-4-4-4z",
  sol: "M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.79 1.42-1.41zM4 10.5H1v2h3v-2zm9-9.95h-2V3.5h2V.55zm7.45 3.91l-1.41-1.41-1.79 1.79 1.41 1.41 1.79-1.79zm-3.21 13.7l1.79 1.8 1.41-1.41-1.8-1.79-1.4 1.4zM20 10.5v2h3v-2h-3zm-8-5c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm-1 16.95h2V19.5h-2v2.95zm-7.45-3.91l1.41 1.41 1.79-1.8-1.41-1.41-1.79 1.8z",
  aparelhos:
    "M4 6h18V4H4c-1.1 0-2 .9-2 2v11H0v3h14v-3H4V6zm19 2h-6c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h6c.55 0 1-.45 1-1V9c0-.55-.45-1-1-1zm-1 9h-4v-7h4v7z",
  camera:
    "M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z",
  certo: "M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z",
  zap: "M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18a8 8 0 0 1-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1 1 12 20Zm4.4-6c-.2-.1-1.4-.7-1.7-.8-.2-.1-.4-.1-.5.1l-.8.9c-.1.2-.3.2-.5.1a6.6 6.6 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.5-.4h-.5a.9.9 0 0 0-.6.3 2.7 2.7 0 0 0-.9 2c0 1.2.9 2.4 1 2.5.1.2 1.8 2.7 4.3 3.8 1.6.7 2.2.7 3 .6.5-.1 1.4-.6 1.6-1.1.2-.6.2-1 .1-1.1l-.6-.4Z",
};

const Icone: React.FC<{ d: string; tamanho: number; cor?: string }> = ({
  d,
  tamanho,
  cor = BRANCO,
}) => (
  <svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill={cor}>
    <path d={d} />
  </svg>
);

// ---------- Cena 1: chamada travando ----------
const Gancho: React.FC = () => {
  const frame = useCurrentFrame();
  const p = useMola(0, 11);
  const treme = frame % 9 < 2 ? (frame % 2 === 0 ? 14 : -14) : 0;
  return (
    <AbsoluteFill>
      <Fundo />
      <Titulo
        topo={150}
        linhas={
          <>
            SUA CHAMADA <span style={{ color: VERMELHO }}>TRAVA</span>
            <br />
            QUANDO VOCÊ
            <br />
            SAI DA SALA?
          </>
        }
      />
      {/* Celular com chamada de vídeo congelada */}
      <div
        style={{
          position: "absolute",
          top: 620,
          left: 290,
          width: 500,
          height: 940,
          borderRadius: 70,
          background: "#0A0F14",
          border: "12px solid #2A3540",
          overflow: "hidden",
          transform: `scale(${p}) translateX(${treme}px)`,
          boxShadow: "0 30px 80px rgba(0,0,0,0.6)",
        }}
      >
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 100 190"
          preserveAspectRatio="none"
        >
          <rect width="100" height="190" fill="#3B5A73" />
          <circle cx="50" cy="70" r="22" fill="#E7B48F" />
          <path d="M18 190 Q20 110 50 108 Q80 110 82 190 Z" fill={LARANJA} />
          {/* "pixels" travados */}
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <rect
              key={i}
              x={(i * 37 + frame * 3) % 90}
              y={(i * 53 + 20) % 170}
              width={14}
              height={8}
              fill="rgba(255,255,255,0.25)"
            />
          ))}
        </svg>
        {/* Carregando */}
        <div
          style={{
            position: "absolute",
            top: "38%",
            left: "50%",
            width: 130,
            height: 130,
            marginLeft: -65,
            borderRadius: "50%",
            border: "14px solid rgba(255,255,255,0.3)",
            borderTopColor: BRANCO,
            transform: `rotate(${frame * 14}deg)`,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 70,
            left: 0,
            right: 0,
            textAlign: "center",
            ...FONTE,
            color: BRANCO,
            fontSize: 34,
          }}
        >
          RECONECTANDO...
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- Casa em corte ----------
// Coordenadas da casa (em pixels da tela)
const CASA = { x: 60, y: 560, l: 960, a: 760 };
const COMODOS = [
  { nome: "SALA", art: "NA", d: D.sofa, x: 0, y: 1, ponto: [240, 560] },
  { nome: "COZINHA", art: "NA", d: D.cozinha, x: 1, y: 1, ponto: [720, 560] },
  { nome: "QUARTO", art: "NO", d: D.cama, x: 0, y: 0, ponto: [240, 260] },
  { nome: "VARANDA", art: "NA", d: D.sol, x: 1, y: 0, ponto: [720, 260] },
];
const ROTEADOR = [150, 640]; // na sala (coordenadas dentro da casa)

const Casa: React.FC<{
  wifi6: boolean;
  alcance: number; // raio das ondas, em pixels
  aceso: number[]; // cômodos acesos
  celular: [number, number] | null;
  sinal: number; // 0 a 4
}> = ({ wifi6, alcance, aceso, celular, sinal }) => {
  const frame = useCurrentFrame();
  const largura = CASA.l;
  const altura = CASA.a;
  return (
    <div
      style={{
        position: "absolute",
        left: CASA.x,
        top: CASA.y,
        width: largura,
        height: altura,
      }}
    >
      <svg width={largura} height={altura} viewBox={`0 0 ${largura} ${altura}`}>
        <defs>
          <clipPath id="dentro">
            <rect x="20" y="110" width={largura - 40} height={altura - 130} />
          </clipPath>
        </defs>
        {/* Telhado */}
        <polygon
          points={`0,120 ${largura / 2},0 ${largura},120`}
          fill={LARANJA}
        />
        {/* Paredes */}
        <rect
          x="20"
          y="110"
          width={largura - 40}
          height={altura - 130}
          fill="#1E4A6B"
          stroke={BRANCO}
          strokeWidth="8"
        />
        {/* Cômodos acesos */}
        {COMODOS.map((c, i) =>
          aceso.indexOf(i) >= 0 ? (
            <rect
              key={c.nome}
              x={24 + c.x * ((largura - 48) / 2)}
              y={114 + c.y * ((altura - 138) / 2)}
              width={(largura - 48) / 2}
              height={(altura - 138) / 2}
              fill={wifi6 ? "#2C6E9B" : "#24597F"}
            />
          ) : null,
        )}
        {/* Ondas do Wi-Fi saindo do roteador */}
        <g clipPath="url(#dentro)">
          {[0, 1, 2, 3].map((i) => {
            const fase =
              ((frame * (wifi6 ? 9 : 6) + i * (alcance / 4)) % alcance) /
              alcance;
            return (
              <circle
                key={i}
                cx={ROTEADOR[0]}
                cy={ROTEADOR[1]}
                r={fase * alcance}
                fill="none"
                stroke={wifi6 ? LARANJA : "#9FB7C9"}
                strokeWidth={wifi6 ? 10 : 7}
                opacity={(1 - fase) * (wifi6 ? 0.9 : 0.6)}
              />
            );
          })}
        </g>
        {/* Paredes internas */}
        <line
          x1={largura / 2}
          y1="110"
          x2={largura / 2}
          y2={altura - 20}
          stroke={BRANCO}
          strokeWidth="8"
        />
        <line
          x1="20"
          y1={110 + (altura - 130) / 2}
          x2={largura - 20}
          y2={110 + (altura - 130) / 2}
          stroke={BRANCO}
          strokeWidth="8"
        />
      </svg>

      {/* Ícone e nome de cada cômodo */}
      {COMODOS.map((c, i) => (
        <div
          key={c.nome}
          style={{
            position: "absolute",
            left: 24 + c.x * ((largura - 48) / 2) + 24,
            top: 114 + c.y * ((altura - 138) / 2) + 20,
            display: "flex",
            alignItems: "center",
            gap: 12,
            ...FONTE,
            color: BRANCO,
            fontSize: 38,
            opacity: aceso.indexOf(i) >= 0 ? 1 : 0.55,
          }}
        >
          <Icone d={c.d} tamanho={56} />
          {c.nome}
        </div>
      ))}

      {/* Roteador */}
      <div
        style={{
          position: "absolute",
          left: ROTEADOR[0] - 70,
          top: ROTEADOR[1] - 40,
          width: 140,
          height: 70,
          borderRadius: 16,
          background: wifi6 ? LARANJA : "#7D8B96",
          border: `5px solid ${BRANCO}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          ...FONTE,
          color: BRANCO,
          fontSize: wifi6 ? 30 : 24,
          boxShadow: wifi6 ? `0 0 40px ${LARANJA}` : "none",
        }}
      >
        {wifi6 ? "WI-FI 6" : "COMUM"}
      </div>

      {/* Celular passeando pela casa, com as barrinhas de sinal */}
      {celular ? (
        <div
          style={{
            position: "absolute",
            left: celular[0] - 45,
            top: celular[1] - 80,
            display: "flex",
            alignItems: "flex-end",
            gap: 10,
          }}
        >
          <div
            style={{
              width: 90,
              height: 160,
              borderRadius: 18,
              background: "#0A0F14",
              border: `5px solid ${BRANCO}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icone
              d={D.camera}
              tamanho={52}
              cor={sinal >= 3 ? VERDE : VERMELHO}
            />
          </div>
          <Barras sinal={sinal} tamanho={70} />
        </div>
      ) : null}
    </div>
  );
};

const Barras: React.FC<{ sinal: number; tamanho: number }> = ({
  sinal,
  tamanho,
}) => {
  const cor = sinal >= 3 ? VERDE : sinal >= 2 ? "#F2B630" : VERMELHO;
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 40 40">
      {[0, 1, 2, 3].map((i) => (
        <rect
          key={i}
          x={i * 10 + 1}
          y={30 - i * 9}
          width="8"
          height={10 + i * 9}
          rx="2"
          fill={i < sinal ? cor : "rgba(255,255,255,0.25)"}
        />
      ))}
    </svg>
  );
};

// Caminho do celular: sala → cozinha → quarto → varanda
const posicao = (t: number, pontos: number[][]): [number, number] => {
  const n = pontos.length - 1;
  const k = Math.min(n - 1, Math.floor(t * n));
  const f = Math.min(1, t * n - k);
  const s = f * f * (3 - 2 * f); // suaviza
  return [
    pontos[k][0] + (pontos[k + 1][0] - pontos[k][0]) * s,
    pontos[k][1] + (pontos[k + 1][1] - pontos[k][1]) * s,
  ];
};

// Status da chamada embaixo da casa
const Status: React.FC<{ ok: boolean; texto: string }> = ({ ok, texto }) => (
  <div
    style={{
      position: "absolute",
      top: 1370,
      left: 0,
      right: 0,
      display: "flex",
      justifyContent: "center",
    }}
  >
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 18,
        background: ok ? VERDE : VERMELHO,
        borderRadius: 999,
        padding: "18px 40px",
        ...FONTE,
        color: BRANCO,
        fontSize: 48,
        border: `5px solid ${BRANCO}`,
      }}
    >
      <Icone d={ok ? D.certo : D.camera} tamanho={56} />
      {texto}
    </div>
  </div>
);

// ---------- Cena 2: roteador comum, sinal cai ----------
const CenaComum: React.FC = () => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [15, 95], [0, 1], clamp);
  const pontos = [COMODOS[0].ponto, COMODOS[1].ponto, COMODOS[2].ponto];
  const pos = posicao(t, pontos);
  const dist = Math.hypot(pos[0] - ROTEADOR[0], pos[1] - ROTEADOR[1]);
  const sinal = Math.max(1, Math.round(4 - dist / 160));
  const sala = t < 0.25;
  return (
    <AbsoluteFill>
      <Fundo />
      <Titulo
        linhas={
          <>
            COM ROTEADOR <span style={{ color: "#9FB7C9" }}>COMUM</span>,
            <br />O SINAL <span style={{ color: VERMELHO }}>NÃO ACOMPANHA</span>
          </>
        }
        tamanho={70}
      />
      <Casa
        wifi6={false}
        alcance={330}
        aceso={[0]}
        celular={pos}
        sinal={sinal}
      />
      <Status ok={sala} texto={sala ? "CHAMADA OK" : "CHAMADA TRAVANDO..."} />
    </AbsoluteFill>
  );
};

// ---------- Cena 3: troca para Wi-Fi 6 ----------
const CenaTroca: React.FC = () => {
  const frame = useCurrentFrame();
  const alcance = interpolate(frame, [10, 50], [330, 1100], clamp);
  const p = useMola(4, 9);
  return (
    <AbsoluteFill>
      <Fundo />
      <Titulo
        linhas={
          <>
            COM <span style={{ color: LARANJA }}>WI-FI 6</span> DA TBN
          </>
        }
        tamanho={86}
      />
      <Casa
        wifi6
        alcance={alcance}
        aceso={frame > 30 ? [0, 1, 2, 3] : [0]}
        celular={null}
        sinal={4}
      />
      <div
        style={{
          position: "absolute",
          top: 1370,
          left: 0,
          right: 0,
          textAlign: "center",
          ...FONTE,
          color: BRANCO,
          fontSize: 56,
          transform: `scale(${p})`,
        }}
      >
        MAIS <span style={{ color: LARANJA }}>ALCANCE</span> E{" "}
        <span style={{ color: LARANJA }}>ESTABILIDADE</span>
      </div>
    </AbsoluteFill>
  );
};

// ---------- Cena 4: passeio pela casa sem travar ----------
const CenaPasseio: React.FC = () => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [10, 150], [0, 1], clamp);
  const pontos = COMODOS.map((c) => c.ponto);
  const pos = posicao(t, pontos);
  const comodo = Math.min(3, Math.round(t * 3));
  return (
    <AbsoluteFill>
      <Fundo />
      <Titulo
        linhas={
          <>
            DA SALA À <span style={{ color: LARANJA }}>VARANDA</span>,
            <br />A CHAMADA <span style={{ color: VERDE }}>NÃO TRAVA</span>
          </>
        }
        tamanho={70}
      />
      <Casa wifi6 alcance={1100} aceso={[0, 1, 2, 3]} celular={pos} sinal={4} />
      <Status
        ok
        texto={`CONECTADO ${COMODOS[comodo].art} ${COMODOS[comodo].nome}`}
      />
      <div
        style={{
          position: "absolute",
          top: 1500,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: FONTE.fontFamily,
          fontWeight: 900,
          color: "rgba(255,255,255,0.6)",
          fontSize: 26,
        }}
      >
        O alcance varia conforme o tamanho e as paredes do imóvel.
      </div>
    </AbsoluteFill>
  );
};

// ---------- Cena 5: vantagens ----------
const Vantagem: React.FC<{
  d: string;
  texto: React.ReactNode;
  atraso: number;
}> = ({ d, texto, atraso }) => {
  const p = useMola(atraso, 11);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 30,
        background: "rgba(255,255,255,0.08)",
        border: `4px solid ${LARANJA}`,
        borderRadius: 36,
        padding: "26px 34px",
        margin: "0 60px 34px",
        transform: `translateX(${interpolate(p, [0, 1], [-400, 0])}px)`,
        opacity: p,
      }}
    >
      <div
        style={{
          minWidth: 130,
          height: 130,
          borderRadius: "50%",
          background: LARANJA,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icone d={d} tamanho={80} />
      </div>
      <div style={{ ...FONTE, color: BRANCO, fontSize: 52, lineHeight: 1.1 }}>
        {texto}
      </div>
    </div>
  );
};

const CenaVantagens: React.FC = () => (
  <AbsoluteFill>
    <Fundo />
    <Titulo
      linhas={
        <>
          POR QUE <span style={{ color: LARANJA }}>WI-FI 6</span>?
        </>
      }
      tamanho={90}
    />
    <div style={{ position: "absolute", top: 480, left: 0, right: 0 }}>
      <Vantagem
        d={D.aparelhos}
        atraso={8}
        texto={
          <>
            VÁRIOS APARELHOS
            <br />
            AO MESMO TEMPO
          </>
        }
      />
      <Vantagem
        d={D.camera}
        atraso={26}
        texto={
          <>
            CHAMADAS E VÍDEOS
            <br />
            MAIS ESTÁVEIS
          </>
        }
      />
      <Vantagem
        d={D.certo}
        atraso={44}
        texto={
          <>
            MENOS
            <br />
            TRAVADAS
          </>
        }
      />
    </div>
  </AbsoluteFill>
);

// ---------- Cena 6: final ----------
const CenaFinal: React.FC = () => {
  const p = useMola(0, 11);
  const p2 = useMola(14, 10);
  const frame = useCurrentFrame();
  const pulso = 1 + Math.sin(frame / 5) * 0.035;
  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        ...FONTE,
        color: BRANCO,
        textAlign: "center",
      }}
    >
      <Fundo />
      <Img
        src={staticFile("tbn/logo-branca.png")}
        style={{
          position: "absolute",
          top: 330,
          width: 560,
          transform: `scale(${p})`,
        }}
      />
      <div style={{ position: "absolute", top: 640, fontSize: 64, opacity: p }}>
        PLANOS COM
      </div>
      <div
        style={{
          position: "absolute",
          top: 720,
          fontSize: 170,
          color: LARANJA,
          lineHeight: 1,
          transform: `scale(${p})`,
          textShadow: `0 0 40px ${LARANJA}66`,
        }}
      >
        WI-FI 6
      </div>
      <div style={{ position: "absolute", top: 930, fontSize: 52, opacity: p }}>
        FIBRA ÓPTICA EM JATAÍ E REGIÃO
      </div>
      <div
        style={{
          position: "absolute",
          top: 1100,
          display: "flex",
          alignItems: "center",
          gap: 22,
          background: VERDE,
          borderRadius: 999,
          padding: "28px 52px",
          border: `5px solid ${BRANCO}`,
          fontSize: 62,
          transform: `scale(${p2 * pulso})`,
          boxShadow: "0 18px 50px rgba(0,0,0,0.45)",
        }}
      >
        <Icone d={D.zap} tamanho={84} />
        {WHATSAPP}
      </div>
      <div
        style={{ position: "absolute", top: 1280, fontSize: 44, opacity: p2 }}
      >
        FALE COM A GENTE
      </div>
    </AbsoluteFill>
  );
};

// ---------- Montagem ----------
const CENAS: { de: number; ate: number; tela: React.ReactNode; som: string }[] =
  [
    { de: T.gancho, ate: T.comum, tela: <Gancho />, som: "wifi6/erro.wav" },
    {
      de: T.comum,
      ate: T.troca,
      tela: <CenaComum />,
      som: "novembro/whoosh.wav",
    },
    { de: T.troca, ate: T.passeio, tela: <CenaTroca />, som: "wifi6/ok.wav" },
    {
      de: T.passeio,
      ate: T.vantagens,
      tela: <CenaPasseio />,
      som: "novembro/whoosh.wav",
    },
    {
      de: T.vantagens,
      ate: T.final,
      tela: <CenaVantagens />,
      som: "novembro/whoosh.wav",
    },
    {
      de: T.final,
      ate: WIFI6_CASA_DURACAO,
      tela: <CenaFinal />,
      som: "wifi6/ok.wav",
    },
  ];

export const Wifi6Casa: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: AZUL }}>
    {CENAS.map((c, i) => (
      <Sequence key={i} from={c.de} durationInFrames={c.ate - c.de}>
        {c.tela}
        <Audio src={staticFile(c.som)} volume={0.5} />
      </Sequence>
    ))}
    {/* Som de erro extra quando o sinal cai */}
    <Sequence from={T.comum + 55} durationInFrames={15}>
      <Audio src={staticFile("wifi6/erro.wav")} volume={0.4} />
    </Sequence>
    {/* Estalos nas vantagens */}
    {[8, 26, 44].map((a) => (
      <Sequence key={a} from={T.vantagens + a} durationInFrames={10}>
        <Audio src={staticFile("novembro/pop.wav")} volume={0.5} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
