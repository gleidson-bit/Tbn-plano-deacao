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
const AZUL = "#0E2639";
const BRANCO = "#FFFFFF";
const FPS = 30;
const WHATSAPP = "(64) 99283-4153";

const VIDEO_SEGUNDOS = 16.6;
const FINAL_SEGUNDOS = 2.5;
export const NOVEMBRO_DURACAO = Math.round(
  (VIDEO_SEGUNDOS + FINAL_SEGUNDOS) * FPS,
);

const q = (s: number) => Math.round(s * FPS);

// Frases da fala, com o segundo em que começam (marcado pela transcrição)
const FRASES: {
  inicio: number;
  fim: number;
  texto: string;
  destaque: string[];
}[] = [
  {
    inicio: 0.3,
    fim: 2.0,
    texto: "VOCÊ CONHECE O WI-FI 6?",
    destaque: ["WI-FI", "6?"],
  },
  {
    inicio: 2.0,
    fim: 4.0,
    texto: "ELE OFERECE MAIS EFICIÊNCIA",
    destaque: ["EFICIÊNCIA"],
  },
  {
    inicio: 4.0,
    fim: 7.0,
    texto: "MELHOR DESEMPENHO COM VÁRIOS DISPOSITIVOS CONECTADOS",
    destaque: ["VÁRIOS", "DISPOSITIVOS"],
  },
  {
    inicio: 7.0,
    fim: 9.6,
    texto: "E UMA CONEXÃO MAIS ESTÁVEL",
    destaque: ["ESTÁVEL"],
  },
  {
    inicio: 10.0,
    fim: 13.3,
    texto: "A TBN ESTÁ BUSCANDO SEMPRE O QUE HÁ DE MELHOR EM TECNOLOGIA",
    destaque: ["TBN", "TECNOLOGIA"],
  },
  {
    inicio: 13.3,
    fim: 16.6,
    texto:
      "PARA OFERECER UMA MELHOR QUALIDADE E UMA MELHOR EXPERIÊNCIA PARA VOCÊ",
    destaque: ["QUALIDADE", "EXPERIÊNCIA"],
  },
];

// Momentos de zoom ("corte seco"), alternando perto e longe
const ZOOMS = [0, 2.07, 4.4, 7.0, 10.0, 13.07];

const useMola = (atraso: number, damping = 12) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - atraso, fps, config: { damping } });
};

// Vídeo com zoom alternado a cada mudança de frase
const VideoDinamico: React.FC<{ mudo?: boolean }> = ({ mudo = false }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  let i = 0;
  ZOOMS.forEach((z, k) => {
    if (t >= z) i = k;
  });
  const base = i % 2 === 0 ? 1.0 : 1.18;
  const desde = frame - q(ZOOMS[i]);
  const soco = interpolate(desde, [0, 6], [1.06, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const deriva = 1 + desde * 0.0006;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <OffthreadVideo
        src={staticFile("novembro/original.mp4")}
        muted={mudo}
        style={{
          width: "100%",
          height: "100%",
          transform: `scale(${base * soco * deriva})`,
          transformOrigin: "50% 38%",
        }}
      />
    </AbsoluteFill>
  );
};

// Legenda palavra por palavra
const Legenda: React.FC<{
  texto: string;
  destaque: string[];
  duracao: number;
}> = ({ texto, destaque, duracao }) => {
  const frame = useCurrentFrame();
  const palavras = texto.split(" ");
  const porPalavra = (duracao * 0.85) / palavras.length;
  // Mostra no máximo 3 palavras por vez
  const atual = Math.min(palavras.length - 1, Math.floor(frame / porPalavra));
  const bloco = Math.floor(atual / 3);
  const visiveis = palavras.slice(bloco * 3, bloco * 3 + 3);
  return (
    <div
      style={{
        position: "absolute",
        top: 1440,
        left: 40,
        right: 40,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        ...FONTE,
        fontSize: 92,
        lineHeight: 1.1,
      }}
    >
      {visiveis.map((p, k) => {
        const idx = bloco * 3 + k;
        const ativa = idx === atual;
        const apareceu = idx <= atual;
        const ehDestaque = destaque.indexOf(p) >= 0;
        return (
          <span
            key={`${idx}-${p}`}
            style={{
              display: "inline-block",
              margin: "0 30px",
              color: ehDestaque ? LARANJA : BRANCO,
              opacity: apareceu ? 1 : 0,
              transform: `scale(${ativa ? 1.06 : 1})`,
              textShadow: "0 0 18px #000, 0 6px 0 #000, 0 -2px 0 #000",
              WebkitTextStroke: "8px #000",
              paintOrder: "stroke fill",
            }}
          >
            {p}
          </span>
        );
      })}
    </div>
  );
};

// Selo que salta na tela (ícone + texto)
const Selo: React.FC<{
  texto: string;
  icone: React.ReactNode;
  topo: number;
  lado: "esquerda" | "direita";
}> = ({ texto, icone, topo, lado }) => {
  const p = useMola(0, 10);
  const frame = useCurrentFrame();
  const flutua = Math.sin(frame / 8) * 6;
  return (
    <div
      style={{
        position: "absolute",
        top: topo + flutua,
        [lado === "esquerda" ? "left" : "right"]: 40,
        display: "flex",
        alignItems: "center",
        gap: 16,
        background: BRANCO,
        color: AZUL,
        ...FONTE,
        fontSize: 46,
        padding: "16px 30px 16px 18px",
        borderRadius: 999,
        border: `5px solid ${LARANJA}`,
        boxShadow: "0 14px 36px rgba(0,0,0,0.45)",
        transform: `scale(${p}) rotate(${lado === "esquerda" ? -4 : 4}deg)`,
      }}
    >
      <div
        style={{
          width: 72,
          height: 72,
          borderRadius: "50%",
          background: LARANJA,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {icone}
      </div>
      {texto}
    </div>
  );
};

const Icone: React.FC<{ d: string }> = ({ d }) => (
  <svg width="46" height="46" viewBox="0 0 24 24" fill={BRANCO}>
    <path d={d} />
  </svg>
);
const RAIO =
  "M11 21h-1l1-7H7.5c-.88 0-.33-.75-.31-.78C8.48 10.94 10.42 7.54 13.01 3h1l-1 7h3.51c.4 0 .62.19.4.66C12.97 17.55 11 21 11 21z";
const APARELHOS =
  "M4 6h18V4H4c-1.1 0-2 .9-2 2v11H0v3h14v-3H4V6zm19 2h-6c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h6c.55 0 1-.45 1-1V9c0-.55-.45-1-1-1zm-1 9h-4v-7h4v7z";
const SINAL =
  "M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3a4.237 4.237 0 0 0-6 0zm-4-4l2 2a7.074 7.074 0 0 1 10 0l2-2C15.14 9.14 8.87 9.14 5 13z";
const ESTRELA =
  "M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z";

// Selo grande "WI-FI 6" na abertura
const SeloWifi6: React.FC = () => {
  const p = useMola(0, 9);
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        top: 560,
        right: 50,
        width: 250,
        height: 250,
        borderRadius: "50%",
        background: LARANJA,
        border: `8px solid ${BRANCO}`,
        boxShadow: `0 0 ${40 + Math.sin(frame / 4) * 20}px ${LARANJA}`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        ...FONTE,
        color: BRANCO,
        lineHeight: 0.95,
        transform: `scale(${p}) rotate(${interpolate(p, [0, 1], [-30, 8])}deg)`,
      }}
    >
      <span style={{ fontSize: 56 }}>WI-FI</span>
      <span style={{ fontSize: 120 }}>6</span>
    </div>
  );
};

// Logo da TBN aparecendo quando ele fala o nome
const LogoTbn: React.FC = () => {
  const p = useMola(0, 11);
  return (
    <div
      style={{
        position: "absolute",
        top: 120,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: AZUL,
          padding: "22px 46px",
          borderRadius: 30,
          border: `5px solid ${LARANJA}`,
          transform: `scale(${p})`,
          boxShadow: "0 14px 40px rgba(0,0,0,0.5)",
        }}
      >
        <Img src={staticFile("tbn/logo-branca.png")} style={{ width: 360 }} />
      </div>
    </div>
  );
};

// Barra de progresso no topo
const Progresso: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        height: 10,
        width: `${(frame / NOVEMBRO_DURACAO) * 100}%`,
        background: LARANJA,
      }}
    />
  );
};

// Tela final com o WhatsApp
const Final: React.FC = () => {
  const p = useMola(0, 11);
  const p2 = useMola(8, 10);
  const frame = useCurrentFrame();
  const pulso = 1 + Math.sin(frame / 5) * 0.035;
  return (
    <AbsoluteFill
      style={{
        background: `rgba(14,38,57,${0.88 * p})`,
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
      <div style={{ fontSize: 76, marginTop: 50, lineHeight: 1.1, opacity: p }}>
        INTERNET COM
        <br />
        <span style={{ color: LARANJA }}>WI-FI 6</span>
      </div>
      <div
        style={{
          marginTop: 60,
          fontSize: 58,
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

type Efeito = {
  em: number;
  som: "whoosh" | "pop";
  tela?: React.ReactNode;
  dura?: number;
};

export const Novembro: React.FC = () => {
  const efeitos: Efeito[] = [
    { em: 0.6, som: "pop", tela: <SeloWifi6 />, dura: 1.6 },
    {
      em: 2.3,
      som: "pop",
      tela: (
        <Selo
          texto="MAIS EFICIÊNCIA"
          icone={<Icone d={RAIO} />}
          topo={420}
          lado="esquerda"
        />
      ),
      dura: 1.4,
    },
    {
      em: 5.3,
      som: "pop",
      tela: (
        <Selo
          texto="VÁRIOS APARELHOS"
          icone={<Icone d={APARELHOS} />}
          topo={420}
          lado="direita"
        />
      ),
      dura: 1.8,
    },
    {
      em: 7.9,
      som: "pop",
      tela: (
        <Selo
          texto="CONEXÃO ESTÁVEL"
          icone={<Icone d={SINAL} />}
          topo={420}
          lado="esquerda"
        />
      ),
      dura: 1.6,
    },
    { em: 10.1, som: "whoosh", tela: <LogoTbn />, dura: 3.0 },
    {
      em: 14.3,
      som: "pop",
      tela: (
        <Selo
          texto="MELHOR EXPERIÊNCIA"
          icone={<Icone d={ESTRELA} />}
          topo={420}
          lado="direita"
        />
      ),
      dura: 2.2,
    },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <Sequence durationInFrames={q(VIDEO_SEGUNDOS)}>
        <VideoDinamico />
      </Sequence>

      {FRASES.map((f, i) => (
        <Sequence
          key={i}
          from={q(f.inicio)}
          durationInFrames={q(f.fim - f.inicio)}
        >
          <Legenda
            texto={f.texto}
            destaque={f.destaque}
            duracao={q(f.fim - f.inicio)}
          />
        </Sequence>
      ))}

      {efeitos.map((e, i) => (
        <Sequence key={i} from={q(e.em)} durationInFrames={q(e.dura ?? 1.5)}>
          {e.tela}
          <Audio src={staticFile(`novembro/${e.som}.wav`)} volume={0.6} />
        </Sequence>
      ))}

      {/* Whoosh nos cortes de câmera */}
      {[2.07, 4.4, 13.07].map((s) => (
        <Sequence key={s} from={q(s) - 4} durationInFrames={15}>
          <Audio src={staticFile("novembro/whoosh.wav")} volume={0.5} />
        </Sequence>
      ))}

      <Sequence from={q(VIDEO_SEGUNDOS)}>
        {/* Último quadro parado, por trás da tela final */}
        <Freeze frame={q(VIDEO_SEGUNDOS) - 1}>
          <VideoDinamico mudo />
        </Freeze>
        <Final />
        <Audio src={staticFile("novembro/whoosh.wav")} volume={0.6} />
      </Sequence>

      <Progresso />
    </AbsoluteFill>
  );
};
