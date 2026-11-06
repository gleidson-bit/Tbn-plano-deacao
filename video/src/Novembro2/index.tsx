import React from "react";
import {
  AbsoluteFill,
  Audio,
  Freeze,
  Img,
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
const BRANCO = "#FFFFFF";
const VERDE = "#2BB673";
const FPS = 30;
const WHATSAPP = "(64) 99283-4153";

const VIDEO_SEGUNDOS = 17.1;
const FINAL_SEGUNDOS = 2.6;
export const NOVEMBRO2_DURACAO = Math.round(
  (VIDEO_SEGUNDOS + FINAL_SEGUNDOS) * FPS,
);
const q = (s: number) => Math.round(s * FPS);

const useMola = (atraso = 0, damping = 12) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - atraso, fps, config: { damping } });
};

// Desenhos simples (ícones em SVG)
const D = {
  notebook:
    "M20 18c1.1 0 1.99-.9 1.99-2L22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z",
  livro:
    "M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z",
  tv: "M21 3H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h5v2h8v-2h5c1.1 0 1.99-.9 1.99-2L23 5c0-1.1-.9-2-2-2zm0 14H3V5h18v12z",
  conversa:
    "M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-3 11H7v-2h10v2zm0-3H7V8h10v2z",
  play: "M8 5v14l11-7z",
  familia:
    "M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z",
  certo: "M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z",
  sinal:
    "M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3a4.237 4.237 0 0 0-6 0zm-4-4l2 2a7.074 7.074 0 0 1 10 0l2-2C15.14 9.14 8.87 9.14 5 13z",
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

// Cartão de fundo dos infográficos (topo da tela, acima da cabeça)
const Cartao: React.FC<{ children: React.ReactNode; topo?: number }> = ({
  children,
  topo = 110,
}) => {
  const p = useMola(0, 13);
  return (
    <div
      style={{
        position: "absolute",
        top: topo,
        left: 60,
        right: 60,
        background: "rgba(14,38,57,0.92)",
        border: `5px solid ${LARANJA}`,
        borderRadius: 40,
        padding: "30px 30px 34px",
        boxShadow: "0 20px 50px rgba(0,0,0,0.45)",
        transform: `translateY(${interpolate(p, [0, 1], [-80, 0])}px) scale(${interpolate(p, [0, 1], [0.9, 1])})`,
        opacity: p,
        ...FONTE,
        color: BRANCO,
        textAlign: "center",
      }}
    >
      {children}
    </div>
  );
};

// Bolinha com ícone e legenda, que salta
const Item: React.FC<{
  d: string;
  rotulo: string;
  atraso: number;
  cor?: string;
}> = ({ d, rotulo, atraso, cor = LARANJA }) => {
  const p = useMola(atraso, 10);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
        transform: `scale(${p})`,
        width: 260,
      }}
    >
      <div
        style={{
          width: 150,
          height: 150,
          borderRadius: "50%",
          background: cor,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: `5px solid ${BRANCO}`,
        }}
      >
        <Icone d={d} tamanho={86} />
      </div>
      <div style={{ fontSize: 38, lineHeight: 1.05 }}>{rotulo}</div>
    </div>
  );
};

// 1) "Internet prática para o dia a dia"
const DiaADia: React.FC = () => (
  <Cartao>
    <div style={{ fontSize: 50, marginBottom: 24 }}>
      PARA O SEU <span style={{ color: LARANJA }}>DIA A DIA</span>
    </div>
    <div style={{ display: "flex", justifyContent: "space-around" }}>
      <Item d={D.notebook} rotulo="TRABALHO" atraso={6} />
      <Item d={D.livro} rotulo="ESTUDO" atraso={14} />
      <Item d={D.tv} rotulo="LAZER" atraso={22} />
    </div>
  </Cartao>
);

// 2) Velocímetro subindo até 300 mega
const Velocimetro: React.FC = () => {
  const frame = useCurrentFrame();
  const valor = interpolate(frame, [6, 36], [0, 300], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });
  const ang = -120 + (valor / 300) * 240;
  const arco = (valor / 300) * 377;
  return (
    <Cartao>
      <svg width="300" height="207" viewBox="0 0 200 138">
        <path
          d="M 30 120 A 80 80 0 1 1 170 120"
          stroke="rgba(255,255,255,0.18)"
          strokeWidth="16"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M 30 120 A 80 80 0 1 1 170 120"
          stroke={LARANJA}
          strokeWidth="16"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${arco} 400`}
          style={{ filter: `drop-shadow(0 0 6px ${LARANJA})` }}
        />
        <line
          x1="100"
          y1="88"
          x2="100"
          y2="30"
          stroke={BRANCO}
          strokeWidth="5"
          strokeLinecap="round"
          transform={`rotate(${ang} 100 88)`}
        />
        <circle cx="100" cy="88" r="9" fill={BRANCO} />
      </svg>
      <div style={{ fontSize: 90, lineHeight: 0.9, marginTop: -24 }}>
        {Math.round(valor)}
        <span style={{ fontSize: 52, color: LARANJA }}> MEGA</span>
      </div>
      <div style={{ fontSize: 34, marginTop: 6 }}>PLANO DA TBN</div>
    </Cartao>
  );
};

// 3) Redes sociais, vídeos e família, cada um na sua fala
const Usos: React.FC<{ tempos: number[] }> = ({ tempos }) => (
  <Cartao>
    <div style={{ fontSize: 50, marginBottom: 24 }}>
      IDEAL <span style={{ color: LARANJA }}>PARA</span>
    </div>
    <div style={{ display: "flex", justifyContent: "space-around" }}>
      <Item d={D.conversa} rotulo="REDES SOCIAIS" atraso={tempos[0]} />
      <Item d={D.play} rotulo="VÍDEOS" atraso={tempos[1]} />
      <Item d={D.familia} rotulo="FAMÍLIA" atraso={tempos[2]} />
    </div>
  </Cartao>
);

// Barra que enche (download / upload)
const Barra: React.FC<{
  rotulo: string;
  seta: "baixo" | "cima";
  atraso: number;
}> = ({ rotulo, seta, atraso }) => {
  const frame = useCurrentFrame();
  const enche = interpolate(frame, [atraso, atraso + 24], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (t) => 1 - Math.pow(1 - t, 2),
  });
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 20,
        margin: "14px 0",
      }}
    >
      <div
        style={{
          width: 90,
          height: 90,
          borderRadius: 24,
          background: LARANJA,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 64,
          transform: seta === "cima" ? "rotate(180deg)" : undefined,
        }}
      >
        <svg width="60" height="60" viewBox="0 0 24 24" fill={BRANCO}>
          <path d="M11 4h2v12l5.5-5.5 1.42 1.42L12 19.84l-7.92-7.92L5.5 10.5 11 16V4Z" />
        </svg>
      </div>
      <div style={{ flex: 1, textAlign: "left" }}>
        <div style={{ fontSize: 36, marginBottom: 8 }}>{rotulo}</div>
        <div
          style={{
            height: 40,
            borderRadius: 20,
            background: "rgba(255,255,255,0.15)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${enche * 100}%`,
              height: "100%",
              background: `linear-gradient(90deg, ${LARANJA}, #FFB066)`,
              borderRadius: 20,
            }}
          />
        </div>
      </div>
      <div style={{ fontSize: 56, width: 150, textAlign: "right" }}>
        {Math.round(enche * 300)}
      </div>
    </div>
  );
};

// 4) Download e upload iguais (na parte de baixo, porque o topo já tem texto no vídeo)
const DownloadUpload: React.FC = () => (
  <Cartao topo={1380}>
    <Barra rotulo="DOWNLOAD (BAIXAR)" seta="baixo" atraso={4} />
    <Barra rotulo="UPLOAD (ENVIAR)" seta="cima" atraso={34} />
    <div style={{ fontSize: 40, marginTop: 10, color: LARANJA }}>
      MESMA VELOCIDADE NOS DOIS SENTIDOS
    </div>
  </Cartao>
);

// 5) Conexão de qualidade
const Qualidade: React.FC = () => {
  const p = useMola(10, 9);
  return (
    <Cartao>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 30,
        }}
      >
        <div
          style={{
            width: 160,
            height: 160,
            borderRadius: "50%",
            background: VERDE,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: `6px solid ${BRANCO}`,
            transform: `scale(${p})`,
          }}
        >
          <Icone d={D.certo} tamanho={110} />
        </div>
        <div style={{ textAlign: "left", fontSize: 64, lineHeight: 1.05 }}>
          CONEXÃO DE
          <br />
          <span style={{ color: LARANJA }}>QUALIDADE</span>
        </div>
      </div>
    </Cartao>
  );
};

// Tela final
const Final: React.FC = () => {
  const p = useMola(0, 11);
  const p2 = useMola(10, 10);
  const frame = useCurrentFrame();
  const pulso = 1 + Math.sin(frame / 5) * 0.035;
  return (
    <AbsoluteFill
      style={{
        background: `rgba(14,38,57,${0.9 * p})`,
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        ...FONTE,
        color: BRANCO,
      }}
    >
      <Img
        src={staticFile("tbn/logo-branca.png")}
        style={{ width: 480, transform: `scale(${p})` }}
      />
      <div
        style={{ fontSize: 80, marginTop: 50, lineHeight: 1.05, opacity: p }}
      >
        PLANO
        <br />
        <span style={{ color: LARANJA }}>300 MEGA</span>
      </div>
      <div style={{ fontSize: 40, marginTop: 16, opacity: p }}>
        300 DOWNLOAD · 300 UPLOAD
      </div>
      <div
        style={{
          marginTop: 60,
          fontSize: 56,
          background: LARANJA,
          padding: "24px 44px",
          borderRadius: 999,
          transform: `scale(${p2 * pulso})`,
        }}
      >
        WHATSAPP {WHATSAPP}
      </div>
    </AbsoluteFill>
  );
};

const Video: React.FC = () => (
  <OffthreadVideo
    src={staticFile("novembro2/original.mp4")}
    style={{ width: "100%", height: "100%" }}
  />
);

// Momentos de cada infográfico (em segundos), no tempo da fala
const CENAS: { de: number; ate: number; tela: React.ReactNode }[] = [
  { de: 0.4, ate: 3.6, tela: <DiaADia /> },
  { de: 3.7, ate: 6.2, tela: <Velocimetro /> },
  // redes sociais ~6,4 s · vídeos ~8,3 s · família ~9,8 s (contados a partir de 6,2 s)
  { de: 6.2, ate: 11.6, tela: <Usos tempos={[6, q(2.1), q(3.6)]} /> },
  { de: 11.7, ate: 14.9, tela: <DownloadUpload /> },
  { de: 15.0, ate: VIDEO_SEGUNDOS, tela: <Qualidade /> },
];

const ESTALOS = [0.6, 3.8, 6.4, 8.3, 9.8, 11.8, 15.2];

export const Novembro2: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "black" }}>
    <Sequence durationInFrames={q(VIDEO_SEGUNDOS)}>
      <Video />
    </Sequence>

    {CENAS.map((c, i) => (
      <Sequence key={i} from={q(c.de)} durationInFrames={q(c.ate - c.de)}>
        {c.tela}
      </Sequence>
    ))}

    {ESTALOS.map((s) => (
      <Sequence key={s} from={q(s)} durationInFrames={10}>
        <Audio src={staticFile("novembro/pop.wav")} volume={0.6} />
      </Sequence>
    ))}

    <Sequence from={q(VIDEO_SEGUNDOS)}>
      {/* Último quadro do vídeo, parado, por trás da tela final */}
      <Freeze frame={0}>
        <OffthreadVideo
          src={staticFile("novembro2/original.mp4")}
          startFrom={q(VIDEO_SEGUNDOS) - 2}
          muted
        />
      </Freeze>
      <Final />
      <Audio src={staticFile("novembro/whoosh.wav")} volume={0.6} />
    </Sequence>
  </AbsoluteFill>
);
