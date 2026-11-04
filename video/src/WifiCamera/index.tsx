import React from "react";
import {
  AbsoluteFill,
  OffthreadVideo,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { FONTE } from "../SoldaTikTok";

const AZUL = "#0A6CFF";
const VERMELHO = "#FF3B30";
const BRANCO = "#FFFFFF";

// Ícones simples (desenhos em SVG)
const ICONES = {
  tv: "M21 3H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h5v2h8v-2h5c1.1 0 1.99-.9 1.99-2L23 5c0-1.1-.9-2-2-2zm0 14H3V5h18v12z",
  celular:
    "M17 1.01 7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z",
  notebook:
    "M20 18c1.1 0 1.99-.9 1.99-2L22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z",
  roteador:
    "M20.2 5.9l.8-.8C19.6 3.7 17.8 3 16 3s-3.6.7-5 2.1l.8.8C13 4.8 14.5 4.2 16 4.2s3 .6 4.2 1.7zm-.9.8c-.9-.9-2.1-1.4-3.3-1.4s-2.4.5-3.3 1.4l.8.8c.7-.7 1.6-1 2.5-1 .9 0 1.8.3 2.5 1l.8-.8zM19 13h-2V9h-2v4H5c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-4c0-1.1-.9-2-2-2zM8 18H6v-2h2v2zm3.5 0h-2v-2h2v2zm3.5 0h-2v-2h2v2z",
};

const useEntrada = (atraso = 0) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - atraso, fps, config: { damping: 12 } });
};

const Icone: React.FC<{
  nome: keyof typeof ICONES;
  tamanho: number;
  cor?: string;
}> = ({ nome, tamanho, cor = BRANCO }) => (
  <svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill={cor}>
    <path d={ICONES[nome]} />
  </svg>
);

// Bolinha com ícone que "salta" na tela
const Bolha: React.FC<{
  nome: keyof typeof ICONES;
  atraso: number;
  x: number;
  y: number;
}> = ({ nome, atraso, x, y }) => {
  const p = useEntrada(atraso);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: 190,
        height: 190,
        borderRadius: "50%",
        background: AZUL,
        border: `6px solid ${BRANCO}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 12px 30px rgba(0,0,0,0.4)",
        transform: `scale(${p})`,
      }}
    >
      <Icone nome={nome} tamanho={110} />
    </div>
  );
};

// Círculo de "carregando" girando
const Carregando: React.FC<{ x: number; y: number }> = ({ x, y }) => {
  const frame = useCurrentFrame();
  const p = useEntrada(18);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: 150,
        height: 150,
        borderRadius: "50%",
        border: "18px solid rgba(255,255,255,0.35)",
        borderTopColor: BRANCO,
        transform: `rotate(${frame * 12}deg) scale(${p})`,
      }}
    />
  );
};

const Legenda: React.FC<{ texto: string; destaque?: string }> = ({
  texto,
  destaque,
}) => {
  const p = useEntrada(4);
  return (
    <div
      style={{
        position: "absolute",
        left: 50,
        right: 50,
        top: 1560,
        textAlign: "center",
        ...FONTE,
        fontSize: 78,
        lineHeight: 1.1,
        color: BRANCO,
        textShadow: "0 0 14px #000, 0 4px 0 #000",
        transform: `translateY(${interpolate(p, [0, 1], [40, 0])}px)`,
        opacity: p,
      }}
    >
      {texto}
      {destaque ? <div style={{ color: "#FFE01B" }}>{destaque}</div> : null}
    </div>
  );
};

// Bloco 1: "Sua internet fica lenta quando todo mundo está conectado?"
const Bloco1: React.FC = () => (
  <AbsoluteFill>
    <Bolha nome="tv" atraso={0} x={90} y={170} />
    <Bolha nome="celular" atraso={6} x={445} y={110} />
    <Bolha nome="notebook" atraso={12} x={800} y={170} />
    <Carregando x={465} y={360} />
    <Legenda texto="SUA INTERNET" destaque="FICA LENTA?" />
  </AbsoluteFill>
);

// Bloco 2: "O problema pode ser o seu roteador"
const Bloco2: React.FC = () => {
  const p = useEntrada(0);
  const x = useEntrada(12);
  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: 365,
          top: 120,
          width: 350,
          height: 350,
          borderRadius: 40,
          background: "rgba(0,0,0,0.55)",
          border: `6px solid ${BRANCO}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `scale(${p})`,
        }}
      >
        <Icone nome="roteador" tamanho={240} />
        <svg
          width="300"
          height="300"
          viewBox="0 0 24 24"
          style={{ position: "absolute", transform: `scale(${x})` }}
        >
          <path
            d="M5 5 19 19M19 5 5 19"
            stroke={VERMELHO}
            strokeWidth={3}
            strokeLinecap="round"
          />
        </svg>
      </div>
      <Legenda texto="O PROBLEMA PODE SER" destaque="O SEU ROTEADOR" />
    </AbsoluteFill>
  );
};

// Momentos (em segundos) em que cada fala começa e termina no vídeo gravado
const BLOCOS: { inicio: number; fim: number; tela: React.FC }[] = [
  { inicio: 1.0, fim: 4.4, tela: Bloco1 },
  { inicio: 4.7, fim: 7.65, tela: Bloco2 },
];

export const WifiCamera: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <OffthreadVideo
        src={staticFile("wifi/teste.mp4")}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      {/* Escurece o topo para as ilustrações aparecerem melhor */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 35%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.6) 100%)",
        }}
      />
      {BLOCOS.map(({ inicio, fim, tela: Tela }, i) => (
        <Sequence
          key={i}
          from={Math.round(inicio * fps)}
          durationInFrames={Math.round((fim - inicio) * fps)}
        >
          <Tela />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
