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

// Mostra um pedaço nítido da arte, no lugar exato, com animação de entrada
const Pedaco: React.FC<{
  x: number;
  y: number;
  l: number;
  a: number;
  atraso: number;
  efeito?: "subir" | "crescer" | "fade";
}> = ({ x, y, l, a, atraso, efeito = "subir" }) => {
  const p = useEntrada(atraso);
  const transform =
    efeito === "crescer"
      ? `scale(${interpolate(p, [0, 1], [0.6, 1])})`
      : efeito === "fade"
        ? "none"
        : `translateY(${interpolate(p, [0, 1], [40, 0])}px)`;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: l,
        height: a,
        overflow: "hidden",
        opacity: p,
        transform,
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
  const zoom = interpolate(frame, [0, 70], [2.8, 2.6]);
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
          transformOrigin: "855px 700px",
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(rgba(14,38,57,0) 40%, rgba(14,38,57,0.9) 80%)",
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
  const zoom = interpolate(frame, [0, TBN_CONHECA_DURACAO], [1, 1.04]);
  const f = (q: number) => q - 60; // tempos abaixo contam do início do vídeo
  const pPreco = useEntrada(f(380), 9);
  const pulsoPreco =
    frame > f(395) ? 1 + Math.sin((frame - f(395)) / 5) * 0.025 : 1;
  const pBotao = useEntrada(f(462), 11);
  const entra = interpolate(frame, [0, 12], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity: entra }}>
      <AbsoluteFill style={{ transform: `scale(${zoom})` }}>
        {/* Arte inteira apagada, de fundo */}
        <Img
          src={ARTE}
          style={{
            width: 1080,
            height: 1920,
            filter: "brightness(0.35) blur(5px)",
          }}
        />

        {/* Logo e "Conheça a TBN" */}
        <Pedaco
          x={70}
          y={180}
          l={560}
          a={370}
          atraso={f(60)}
          efeito="crescer"
        />
        {/* Prédio à direita aparece junto */}
        <Pedaco x={400} y={0} l={680} a={1160} atraso={f(62)} efeito="fade" />
        {/* Frase */}
        <Pedaco x={70} y={570} l={420} a={170} atraso={f(75)} />
        {/* Serviços, um por vez */}
        <Pedaco x={70} y={755} l={340} a={115} atraso={f(175)} />
        <Pedaco x={70} y={875} l={340} a={115} atraso={f(198)} />
        <Pedaco x={70} y={995} l={340} a={115} atraso={f(221)} />
        {/* Moldura dos planos */}
        <Pedaco
          x={60}
          y={1160}
          l={960}
          a={250}
          atraso={f(268)}
          efeito="crescer"
        />
        {/* Planos, um por vez */}
        <Pedaco
          x={130}
          y={1255}
          l={180}
          a={150}
          atraso={f(280)}
          efeito="crescer"
        />
        <Pedaco
          x={350}
          y={1255}
          l={180}
          a={150}
          atraso={f(298)}
          efeito="crescer"
        />
        <Pedaco
          x={565}
          y={1255}
          l={180}
          a={150}
          atraso={f(318)}
          efeito="crescer"
        />
        <Pedaco
          x={785}
          y={1255}
          l={180}
          a={150}
          atraso={f(340)}
          efeito="crescer"
        />

        {/* Preço */}
        <div
          style={{
            position: "absolute",
            left: 160,
            top: 1400,
            width: 760,
            height: 140,
            overflow: "hidden",
            opacity: pPreco,
            transform: `scale(${interpolate(pPreco, [0, 1], [0.5, 1]) * pulsoPreco})`,
          }}
        >
          <Img
            src={ARTE}
            style={{
              position: "absolute",
              left: -160,
              top: -1400,
              width: 1080,
              height: 1920,
            }}
          />
        </div>

        {/* Fundo de baixo e botão */}
        <Pedaco x={0} y={1540} l={1080} a={380} atraso={f(455)} efeito="fade" />
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

export const TbnConheca: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: AZUL }}>
    <Sequence from={60}>
      <Cartaz />
    </Sequence>
    <Sequence durationInFrames={72}>
      <Abertura />
    </Sequence>
    {FALAS.map((inicio, i) => (
      <Sequence key={i} from={inicio}>
        <Audio src={staticFile(`narracao-conheca/${i + 1}.wav`)} volume={1.7} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
