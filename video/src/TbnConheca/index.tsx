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

const ARTE = staticFile("tbn/conheca.png");
const LARANJA = "#F37F19";
const AZUL = "#0E2639";
const WHATSAPP = "(64) 99283-4153";

export const TBN_CONHECA_DURACAO = 630;

// Quando cada fala começa (em quadros, 30 = 1 segundo)
const FALAS = [8, 66, 170, 268, 378, 458];

const useEntrada = (atraso: number, damping = 12) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - atraso, fps, config: { damping } });
};

// Dá um "salto" de destaque num pedaço da arte, no lugar exato
const Destaque: React.FC<{
  x: number;
  y: number;
  l: number;
  a: number;
  atraso: number;
  forca?: number;
}> = ({ x, y, l, a, atraso, forca = 0.08 }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [atraso, atraso + 7, atraso + 22], [0, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  if (t === 0) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: l,
        height: a,
        overflow: "hidden",
        borderRadius: 24,
        transform: `scale(${1 + forca * t})`,
        boxShadow: `0 ${20 * t}px ${50 * t}px rgba(0,0,0,${0.55 * t})`,
      }}
    >
      <Img
        src={ARTE}
        style={{
          position: "absolute",
          left: -x,
          top: -y,
          width: 1080,
          height: 1920,
        }}
      />
    </div>
  );
};

// Abertura: zoom na fachada da sede
const Abertura: React.FC = () => {
  const frame = useCurrentFrame();
  const zoom = interpolate(frame, [0, 70], [2.25, 2.12]);
  const p = useEntrada(4, 10);
  const sai = interpolate(frame, [58, 70], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ opacity: sai }}>
      <Img
        src={ARTE}
        style={{
          width: 1080,
          height: 1920,
          transform: `scale(${zoom})`,
          transformOrigin: "1000px 760px",
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(rgba(14,38,57,0) 35%, rgba(14,38,57,0.92) 62%, #0E2639 74%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 1180,
          width: "100%",
          textAlign: "center",
          ...FONTE,
          color: "white",
          fontSize: 110,
          lineHeight: 1,
          transform: `scale(${p})`,
          opacity: interpolate(frame, [44, 54], [1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          textShadow: "0 10px 40px rgba(0,0,0,0.6)",
        }}
      >
        CONHEÇA A<div style={{ color: LARANJA, fontSize: 220 }}>TBN</div>
      </div>
    </AbsoluteFill>
  );
};

// Toque no botão: círculo que se abre na ponta do dedo
const Toque: React.FC<{ atraso: number }> = ({ atraso }) => {
  const frame = useCurrentFrame();
  const t = ((frame - atraso) % 40) / 40;
  if (frame < atraso) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: 597 - 60 * t,
        top: 1702 - 60 * t,
        width: 120 * t,
        height: 120 * t,
        borderRadius: "50%",
        border: `5px solid ${LARANJA}`,
        opacity: 1 - t,
      }}
    />
  );
};

const Cartaz: React.FC = () => {
  const frame = useCurrentFrame();
  const zoom = interpolate(frame, [0, TBN_CONHECA_DURACAO], [1, 1.05]);
  const f = (q: number) => q - 60; // tempos abaixo contam do início do vídeo
  const pBotao = useEntrada(f(462), 11);

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ transform: `scale(${zoom})` }}>
        {/* Arte inteira, sempre nítida */}
        <Img src={ARTE} style={{ width: 1080, height: 1920 }} />

        {/* Destaques, um por vez */}
        <Destaque x={70} y={290} l={540} a={260} atraso={f(70)} />
        <Destaque x={70} y={570} l={420} a={170} atraso={f(110)} />
        <Destaque x={70} y={755} l={340} a={115} atraso={f(170)} forca={0.12} />
        <Destaque x={70} y={875} l={340} a={115} atraso={f(200)} forca={0.12} />
        <Destaque x={70} y={995} l={340} a={115} atraso={f(230)} forca={0.12} />
        <Destaque
          x={130}
          y={1255}
          l={180}
          a={150}
          atraso={f(280)}
          forca={0.15}
        />
        <Destaque
          x={350}
          y={1255}
          l={180}
          a={150}
          atraso={f(300)}
          forca={0.15}
        />
        <Destaque
          x={565}
          y={1255}
          l={180}
          a={150}
          atraso={f(320)}
          forca={0.15}
        />
        <Destaque
          x={785}
          y={1255}
          l={180}
          a={150}
          atraso={f(340)}
          forca={0.15}
        />
        <Destaque
          x={170}
          y={1405}
          l={740}
          a={130}
          atraso={f(385)}
          forca={0.12}
        />
        <Destaque
          x={170}
          y={1405}
          l={740}
          a={130}
          atraso={f(410)}
          forca={0.12}
        />

        {/* Botão com o WhatsApp */}
        <div
          style={{
            position: "absolute",
            left: 378,
            top: 1644,
            width: 324,
            height: 72,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            ...FONTE,
            fontSize: 34,
            color: "white",
            opacity: pBotao,
          }}
        >
          {WHATSAPP}
        </div>
        <div
          style={{
            position: "absolute",
            top: 1572,
            width: "100%",
            textAlign: "center",
            ...FONTE,
            fontSize: 40,
            color: LARANJA,
            opacity: pBotao,
            transform: `translateY(${interpolate(pBotao, [0, 1], [20, 0])}px)`,
          }}
        >
          CHAMA NO WHATSAPP
        </div>
        <Toque atraso={f(475)} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const TbnConheca: React.FC<{ narracao?: boolean }> = ({
  narracao = false,
}) => (
  <AbsoluteFill style={{ backgroundColor: AZUL }}>
    <Sequence from={58}>
      <Cartaz />
    </Sequence>
    <Sequence durationInFrames={72}>
      <Abertura />
    </Sequence>
    {(narracao ? FALAS : []).map((inicio, i) => (
      <Sequence key={i} from={inicio}>
        <Audio src={staticFile(`narracao-conheca/${i + 1}.wav`)} volume={1.7} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
