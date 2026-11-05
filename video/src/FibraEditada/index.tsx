import React from "react";
import {
  AbsoluteFill,
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
const AZUL_ESCURO = "#0E2639";
const FPS = 30;
const VIDEO = staticFile("fibra/original.mp4");

// Trechos do vídeo original que ficam (em segundos). As pausas sem fala entre eles saem.
const TRECHOS = [
  [0, 7.86],
  [10.25, 14.6],
  [17.25, 21.2],
  [24.25, 30.15],
  [31.25, 35.0],
  [36.45, 41.0],
];
// Segura a tela final parada por mais um tempo para dar tempo de ler o WhatsApp
const SEGURA_FINAL = 45;

const quadros = (s: number) => Math.round(s * FPS);
const duracoes = TRECHOS.map(([a, b]) => quadros(b) - quadros(a));
const soma = (l: number[]) => l.reduce((a, b) => a + b, 0);
export const FIBRA_DURACAO = soma(duracoes) + SEGURA_FINAL;

const useEntrada = (atraso = 0) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - atraso, fps, config: { damping: 13 } });
};

// Pergunta no topo da abertura, para prender quem está rolando a tela
const Gancho: React.FC = () => {
  const frame = useCurrentFrame();
  const p = useEntrada(3);
  const sai = interpolate(frame, [95, 110], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        top: 80,
        left: 40,
        right: 40,
        textAlign: "center",
        ...FONTE,
        fontSize: 50,
        lineHeight: 1.1,
        color: "white",
        background: LARANJA,
        borderRadius: 28,
        padding: "20px 20px",
        boxShadow: "0 14px 40px rgba(0,0,0,0.45)",
        transform: `scale(${p})`,
        opacity: sai,
      }}
    >
      VOCÊ SABE COMO A INTERNET
      <br />
      CHEGA NA SUA CASA?
    </div>
  );
};

// Selo "instalação em até 24h" na tela final
const Selo24h: React.FC = () => {
  const frame = useCurrentFrame();
  const p = useEntrada(8);
  const pulso = 1 + Math.sin(frame / 6) * 0.03;
  return (
    <div
      style={{
        position: "absolute",
        top: 470,
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
          ...FONTE,
          fontSize: 52,
          color: AZUL_ESCURO,
          background: "white",
          border: `6px solid ${LARANJA}`,
          borderRadius: 999,
          padding: "16px 40px",
          transform: `scale(${p * pulso})`,
        }}
      >
        {/* Relógio */}
        <svg width="64" height="64" viewBox="0 0 24 24" fill={LARANJA}>
          <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16Zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7Z" />
        </svg>
        INSTALAÇÃO EM ATÉ 24H
      </div>
    </div>
  );
};

export const FibraEditada: React.FC = () => {
  const ultimo = TRECHOS.length - 1;
  return (
    <AbsoluteFill style={{ backgroundColor: AZUL_ESCURO }}>
      {TRECHOS.map(([inicio, fim], i) => (
        <Sequence
          key={i}
          from={soma(duracoes.slice(0, i))}
          durationInFrames={duracoes[i]}
        >
          <OffthreadVideo
            src={VIDEO}
            startFrom={quadros(inicio)}
            endAt={quadros(fim)}
          />
        </Sequence>
      ))}

      {/* Última imagem parada no final, sem som */}
      <Sequence from={soma(duracoes)} durationInFrames={SEGURA_FINAL}>
        <Freeze frame={duracoes[ultimo] - 1}>
          <OffthreadVideo
            src={VIDEO}
            startFrom={quadros(TRECHOS[ultimo][0])}
            muted
          />
        </Freeze>
      </Sequence>

      <Sequence durationInFrames={110}>
        <Gancho />
      </Sequence>

      <Sequence from={soma(duracoes.slice(0, ultimo))}>
        <Selo24h />
      </Sequence>
    </AbsoluteFill>
  );
};
