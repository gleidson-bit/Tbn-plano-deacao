import React from "react";
import {
  AbsoluteFill,
  Audio,
  Freeze,
  OffthreadVideo,
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
const BRANCO = "#FFFFFF";
const VERDE = "#2BB673";
const FPS = 30;
const WHATSAPP = "(64) 99283-4153";

const VIDEO = staticFile("video4/original.mp4");
// O original termina com 1,3 s de tela preta a partir de 16,97 s: cortamos ali
const VIDEO_SEGUNDOS = 16.9;
const FINAL_SEGUNDOS = 2.5;
export const PRECO_FIXO_DURACAO = Math.round(
  (VIDEO_SEGUNDOS + FINAL_SEGUNDOS) * FPS,
);
const q = (s: number) => Math.round(s * FPS);

const useMola = (atraso = 0, damping = 11) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - atraso, fps, config: { damping } });
};

// Frases da narração (segundos marcados pela transcrição)
// Frases da narração (segundos marcados pela transcrição).
// "|" separa os blocos que aparecem juntos na tela, cortados por sentido.
const FRASES: { de: number; ate: number; texto: string; destaque: string[] }[] =
  [
    {
      de: 0.3,
      ate: 2.8,
      texto: "A CHAMADA | COMEÇA NA SALA",
      destaque: ["SALA"],
    },
    {
      de: 2.8,
      ate: 4.0,
      texto: "CONTINUA | NA COZINHA",
      destaque: ["COZINHA"],
    },
    { de: 4.0, ate: 5.0, texto: "PASSA PELO | QUARTO", destaque: ["QUARTO"] },
    { de: 5.0, ate: 6.9, texto: "SAI NA | VARANDA", destaque: ["VARANDA"] },
    {
      de: 6.9,
      ate: 9.0,
      texto: "SORRINDO | PARA A CÂMERA",
      destaque: ["CÂMERA"],
    },
    {
      de: 9.0,
      ate: 11.0,
      texto: "E A CONVERSA | SEGUE SEM TRAVAR",
      destaque: ["SEM", "TRAVAR"],
    },
    {
      de: 11.0,
      ate: 13.1,
      texto: "CONHEÇA OS PLANOS | COM O WI-FI 6",
      destaque: ["PLANOS", "WI-FI", "6"],
    },
  ];

const Legenda: React.FC<{
  texto: string;
  destaque: string[];
  duracao: number;
}> = ({ texto, destaque, duracao }) => {
  const frame = useCurrentFrame();
  const blocos = texto.split(" | ").map((b) => b.split(" "));
  const total = blocos.reduce((n, b) => n + b.length, 0);
  const porPalavra = (duracao * 0.92) / total;
  const atualGeral = Math.min(total - 1, Math.floor(frame / porPalavra));
  // Descobre em qual bloco e palavra estamos
  let resto = atualGeral;
  let bloco = 0;
  while (resto >= blocos[bloco].length) {
    resto -= blocos[bloco].length;
    bloco++;
  }
  const atual = resto;
  const visiveis = blocos[bloco];
  const inicioBloco = 0;
  return (
    <div
      style={{
        position: "absolute",
        top: 1240,
        left: 30,
        right: 30,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        ...FONTE,
        fontSize: 88,
        lineHeight: 1.12,
      }}
    >
      {visiveis.map((p, k) => {
        const idx = inicioBloco + k;
        return (
          <span
            key={`${idx}-${p}`}
            style={{
              display: "inline-block",
              margin: "0 26px",
              color: destaque.indexOf(p) >= 0 ? LARANJA : BRANCO,
              opacity: idx <= atual ? 1 : 0,
              transform: `scale(${idx === atual ? 1.06 : 1})`,
              WebkitTextStroke: "10px #0B1E2E",
              paintOrder: "stroke fill",
              textShadow: "0 8px 0 #0B1E2E",
            }}
          >
            {p}
          </span>
        );
      })}
    </div>
  );
};

// ---------- Desenhos ----------
const D = {
  sofa: "M21 10c-1.1 0-2 .9-2 2v3H5v-3c0-1.1-.89-2-2-2s-2 .9-2 2v5c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2v-5c0-1.1-.9-2-2-2zm-3-5H6c-1.1 0-2 .9-2 2v2.15c1.16.41 2 1.51 2 2.82V14h12v-2.03c0-1.3.84-2.4 2-2.82V7c0-1.1-.9-2-2-2z",
  cozinha:
    "M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z",
  cama: "M7 13c1.66 0 3-1.34 3-3S8.66 7 7 7s-3 1.34-3 3 1.34 3 3 3zm12-6h-8v7H3V5H1v15h2v-3h18v3h2v-9c0-2.21-1.79-4-4-4z",
  sol: "M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.79 1.42-1.41zM4 10.5H1v2h3v-2zm9-9.95h-2V3.5h2V.55zm7.45 3.91l-1.41-1.41-1.79 1.79 1.41 1.41 1.79-1.79zm-3.21 13.7l1.79 1.8 1.41-1.41-1.8-1.79-1.4 1.4zM20 10.5v2h3v-2h-3zm-8-5c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm-1 16.95h2V19.5h-2v2.95zm-7.45-3.91l1.41 1.41 1.79-1.8-1.41-1.41-1.79 1.8z",
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

// Ondas do Wi-Fi pulsando
const OndasWifi: React.FC<{ tamanho: number }> = ({ tamanho }) => {
  const frame = useCurrentFrame();
  return (
    <svg width={tamanho} height={tamanho * 0.7} viewBox="0 0 24 17">
      {[0, 1, 2].map((i) => {
        const brilho = 0.35 + 0.65 * Math.max(0, Math.sin((frame - i * 4) / 5));
        const r = 3 + i * 4;
        return (
          <path
            key={i}
            d={`M ${12 - r} ${15 - r * 0.55} Q 12 ${15 - r * 1.35} ${12 + r} ${15 - r * 0.55}`}
            stroke={LARANJA}
            strokeWidth="2.2"
            strokeLinecap="round"
            fill="none"
            opacity={brilho}
          />
        );
      })}
      <circle cx="12" cy="15.5" r="1.6" fill={LARANJA} />
    </svg>
  );
};

// ---------- Mapa da casa: cômodos acendem conforme a narração ----------
const COMODOS = [
  { nome: "SALA", d: D.sofa, em: 0.3 },
  { nome: "COZINHA", d: D.cozinha, em: 2.8 },
  { nome: "QUARTO", d: D.cama, em: 4.0 },
  { nome: "VARANDA", d: D.sol, em: 5.0 },
];

const MapaCasa: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS + COMODOS[0].em; // a sequência começa em 0,3 s
  const entra = useMola(0, 13);
  let ativo = 0;
  COMODOS.forEach((c, i) => {
    if (t >= c.em) ativo = i;
  });
  const largura = 240;
  return (
    <div
      style={{
        position: "absolute",
        top: 190,
        left: 40,
        right: 40,
        background: "rgba(14,38,57,0.88)",
        border: `4px solid ${LARANJA}`,
        borderRadius: 36,
        padding: "22px 10px 26px",
        display: "flex",
        justifyContent: "space-around",
        transform: `translateY(${interpolate(entra, [0, 1], [-60, 0])}px)`,
        opacity: entra,
        boxShadow: "0 18px 40px rgba(0,0,0,0.4)",
      }}
    >
      {COMODOS.map((c, i) => {
        const aceso = i <= ativo;
        const atual = i === ativo;
        const pulo = atual
          ? spring({
              frame: frame - q(c.em - COMODOS[0].em),
              fps: FPS,
              config: { damping: 9 },
            })
          : 1;
        return (
          <div
            key={c.nome}
            style={{
              width: largura,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 6,
              opacity: aceso ? 1 : 0.35,
              transform: `scale(${atual ? 0.9 + 0.2 * pulo : 1})`,
            }}
          >
            <div style={{ height: 60, opacity: atual ? 1 : 0 }}>
              <OndasWifi tamanho={86} />
            </div>
            <div
              style={{
                width: 140,
                height: 140,
                borderRadius: 30,
                background: aceso ? LARANJA : "rgba(255,255,255,0.12)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: `4px solid ${atual ? BRANCO : "transparent"}`,
              }}
            >
              <Icone d={c.d} tamanho={86} />
            </div>
            <div
              style={{ ...FONTE, color: BRANCO, fontSize: 42, marginTop: 6 }}
            >
              {c.nome}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Selo que salta (ícone + texto)
const Selo: React.FC<{
  d: string;
  linhas: React.ReactNode;
  cor?: string;
  topo?: number;
}> = ({ d, linhas, cor = LARANJA, topo = 220 }) => {
  const p = useMola(0, 10);
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        top: topo + Math.sin(frame / 9) * 6,
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
          gap: 22,
          background: BRANCO,
          borderRadius: 999,
          border: `6px solid ${cor}`,
          padding: "16px 44px 16px 16px",
          boxShadow: "0 16px 40px rgba(0,0,0,0.4)",
          ...FONTE,
          color: AZUL,
          fontSize: 56,
          lineHeight: 1.05,
          transform: `scale(${p}) rotate(-2deg)`,
        }}
      >
        <div
          style={{
            width: 110,
            height: 110,
            borderRadius: "50%",
            background: cor,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icone d={d} tamanho={70} />
        </div>
        <div>{linhas}</div>
      </div>
    </div>
  );
};

// Botão do WhatsApp
const BotaoZap: React.FC<{ topo: number }> = ({ topo }) => {
  const p = useMola(0, 10);
  const frame = useCurrentFrame();
  const pulso = 1 + Math.sin(frame / 5) * 0.035;
  return (
    <div
      style={{
        position: "absolute",
        top: topo,
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
          gap: 20,
          background: VERDE,
          borderRadius: 999,
          padding: "24px 46px",
          border: `5px solid ${BRANCO}`,
          boxShadow: "0 16px 40px rgba(0,0,0,0.4)",
          ...FONTE,
          color: BRANCO,
          fontSize: 58,
          transform: `scale(${p * pulso})`,
        }}
      >
        <Icone d={D.zap} tamanho={76} />
        {WHATSAPP}
      </div>
    </div>
  );
};

// Cartão do Wi-Fi 6 que cobre o texto "preço fixo" da tela final original,
// para o final ter uma mensagem só (Wi-Fi 6) e o WhatsApp
const CartaoWifi6: React.FC = () => {
  const p = useMola(0, 12);
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        top: 730,
        left: 70,
        right: 70,
        height: 440,
        borderRadius: 48,
        background: AZUL,
        border: `6px solid ${LARANJA}`,
        boxShadow: `0 0 ${30 + Math.sin(frame / 5) * 14}px ${LARANJA}88`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        ...FONTE,
        color: BRANCO,
        textAlign: "center",
        transform: `scale(${interpolate(p, [0, 1], [0.85, 1])})`,
        opacity: p,
      }}
    >
      <div style={{ fontSize: 48 }}>PLANOS COM</div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 20,
          fontSize: 140,
          lineHeight: 1,
          color: LARANJA,
          margin: "8px 0 14px",
        }}
      >
        <OndasWifi tamanho={130} />
        WI-FI 6
      </div>
      <div style={{ fontSize: 50 }}>SINAL NA CASA TODA</div>
    </div>
  );
};

// ---------- Montagem ----------
const ELEMENTOS: {
  de: number;
  ate: number;
  som: "pop" | "whoosh";
  tela: React.ReactNode;
}[] = [
  { de: 0.3, ate: 6.9, som: "whoosh", tela: <MapaCasa /> },
  {
    de: 7.0,
    ate: 9.0,
    som: "pop",
    tela: (
      <Selo
        d={D.camera}
        linhas={
          <>
            CHAMADA DE
            <br />
            <span style={{ color: LARANJA }}>VÍDEO</span>
          </>
        }
      />
    ),
  },
  {
    de: 9.1,
    ate: 13.0,
    som: "pop",
    tela: (
      <Selo
        d={D.certo}
        cor={VERDE}
        linhas={
          <>
            SEM <span style={{ color: VERDE }}>TRAVAR</span>
          </>
        }
      />
    ),
  },
  // "Wi-Fi 6 da TBN" — sobre a tela final do original, abaixo do texto dela
  {
    de: 13.2,
    ate: VIDEO_SEGUNDOS + FINAL_SEGUNDOS,
    som: "whoosh",
    tela: <CartaoWifi6 />,
  },
  // "Fale com a gente no WhatsApp"
  {
    de: 15.0,
    ate: VIDEO_SEGUNDOS + FINAL_SEGUNDOS,
    som: "pop",
    tela: <BotaoZap topo={1260} />,
  },
];

export const PrecoFixo: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: AZUL }}>
    <Sequence durationInFrames={q(VIDEO_SEGUNDOS)}>
      <OffthreadVideo src={VIDEO} style={{ width: "100%", height: "100%" }} />
    </Sequence>

    {/* Final: a última imagem da tela da TBN fica parada (o Wi-Fi 6 e o WhatsApp continuam por cima) */}
    <Sequence from={q(VIDEO_SEGUNDOS)}>
      <Freeze frame={0}>
        <OffthreadVideo src={VIDEO} startFrom={q(VIDEO_SEGUNDOS) - 2} muted />
      </Freeze>
    </Sequence>

    {ELEMENTOS.map((e, i) => (
      <Sequence key={i} from={q(e.de)} durationInFrames={q(e.ate - e.de)}>
        {e.tela}
        <Audio src={staticFile(`novembro/${e.som}.wav`)} volume={0.5} />
      </Sequence>
    ))}

    {FRASES.map((f, i) => (
      <Sequence key={i} from={q(f.de)} durationInFrames={q(f.ate - f.de)}>
        <Legenda
          texto={f.texto}
          destaque={f.destaque}
          duracao={q(f.ate - f.de)}
        />
      </Sequence>
    ))}
  </AbsoluteFill>
);
