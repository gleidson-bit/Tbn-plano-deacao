import React from "react";
import {
  AbsoluteFill,
  Audio,
  Freeze,
  OffthreadVideo,
  Sequence,
  random,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { FONTE } from "../SoldaTikTok";

// Cores do Colégio Dinâmico + rosa de doce
const AZUL = "#1C5FB8";
const VERDE = "#8CC63F";
const ROSA = "#FF4F9A";
const BRANCO = "#FFFFFF";
const FPS = 30;

const VIDEO = staticFile("video3/original.mp4");
const VIDEO_SEGUNDOS = 23.7;
const FINAL_SEGUNDOS = 3;
export const DOCE_DURACAO = Math.round((VIDEO_SEGUNDOS + FINAL_SEGUNDOS) * FPS);
const q = (s: number) => Math.round(s * FPS);

const useMola = (atraso = 0, damping = 11) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - atraso, fps, config: { damping } });
};

// Legenda: frases com o segundo em que começam e terminam (pela transcrição)
const FRASES: { de: number; ate: number; texto: string; destaque: string[] }[] =
  [
    { de: 0.2, ate: 1.8, texto: "VOCÊ ESTÁ PROCURANDO", destaque: [] },
    {
      de: 1.8,
      ate: 3.5,
      texto: "ALGUMA COISA PARA ADOÇAR O SEU DIA?",
      destaque: ["ADOÇAR"],
    },
    { de: 3.6, ate: 5.2, texto: "ENTÃO SE PREPAREM", destaque: ["PREPAREM"] },
    {
      de: 7.3,
      ate: 9.1,
      texto: "PARA ADOÇAR O DIA DE VOCÊS!",
      destaque: ["ADOÇAR"],
    },
    {
      de: 9.4,
      ate: 11.0,
      texto: "ENTÃO JÁ MARCA NA AGENDA",
      destaque: ["AGENDA"],
    },
    {
      de: 11.0,
      ate: 12.7,
      texto: "NÃO PERDE ESSA OPORTUNIDADE",
      destaque: ["OPORTUNIDADE"],
    },
    {
      de: 12.7,
      ate: 14.7,
      texto: "DE EXPERIMENTAR NOSSAS DELÍCIAS!",
      destaque: ["DELÍCIAS!"],
    },
    {
      de: 16.75,
      ate: 18.2,
      texto: "NO DIA 27 DE NOVEMBRO",
      destaque: ["27", "NOVEMBRO"],
    },
    {
      de: 18.2,
      ate: 21.5,
      texto: "NOSSO PROJETO EDUCAÇÃO FINANCEIRA ENTRA EM AÇÃO",
      destaque: ["EDUCAÇÃO", "FINANCEIRA"],
    },
    {
      de: 21.9,
      ate: 23.7,
      texto: "VAI VENDER DOCINHOS DELICIOSOS!",
      destaque: ["DOCINHOS", "DELICIOSOS!"],
    },
  ];

const Legenda: React.FC<{
  texto: string;
  destaque: string[];
  duracao: number;
}> = ({ texto, destaque, duracao }) => {
  const frame = useCurrentFrame();
  const palavras = texto.split(" ");
  const porPalavra = (duracao * 0.9) / palavras.length;
  const atual = Math.min(palavras.length - 1, Math.floor(frame / porPalavra));
  const bloco = Math.floor(atual / 3);
  const visiveis = palavras.slice(bloco * 3, bloco * 3 + 3);
  return (
    <div
      style={{
        position: "absolute",
        top: 1480,
        left: 30,
        right: 30,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        ...FONTE,
        fontSize: 86,
        lineHeight: 1.12,
      }}
    >
      {visiveis.map((p, k) => {
        const idx = bloco * 3 + k;
        const ativa = idx === atual;
        return (
          <span
            key={`${idx}-${p}`}
            style={{
              display: "inline-block",
              margin: "0 26px",
              color: destaque.indexOf(p) >= 0 ? ROSA : BRANCO,
              opacity: idx <= atual ? 1 : 0,
              transform: `scale(${ativa ? 1.06 : 1})`,
              WebkitTextStroke: "10px #10305C",
              paintOrder: "stroke fill",
              textShadow: "0 8px 0 #10305C",
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

const Bala: React.FC<{ tamanho: number; cor: string }> = ({ tamanho, cor }) => (
  <svg width={tamanho} height={tamanho * 0.55} viewBox="0 0 100 55">
    <polygon
      points="0,8 26,27 0,47"
      fill={cor}
      stroke={BRANCO}
      strokeWidth="3"
    />
    <polygon
      points="100,8 74,27 100,47"
      fill={cor}
      stroke={BRANCO}
      strokeWidth="3"
    />
    <ellipse
      cx="50"
      cy="27"
      rx="27"
      ry="22"
      fill={cor}
      stroke={BRANCO}
      strokeWidth="4"
    />
    <path
      d="M35 14 Q50 27 35 40 M50 7 Q65 27 50 48"
      stroke="rgba(255,255,255,0.75)"
      strokeWidth="5"
      fill="none"
    />
  </svg>
);

const Cupcake: React.FC<{ tamanho: number }> = ({ tamanho }) => (
  <svg width={tamanho} height={tamanho} viewBox="0 0 100 100">
    <path
      d="M22 52 L30 92 L70 92 L78 52 Z"
      fill={AZUL}
      stroke={BRANCO}
      strokeWidth="4"
    />
    <path
      d="M38 52 L42 92 M58 52 L56 92"
      stroke="rgba(255,255,255,0.5)"
      strokeWidth="4"
    />
    <path
      d="M16 54 Q10 36 28 32 Q30 14 50 18 Q70 12 74 32 Q92 36 84 54 Z"
      fill={ROSA}
      stroke={BRANCO}
      strokeWidth="4"
    />
    <circle
      cx="50"
      cy="12"
      r="8"
      fill="#E8283C"
      stroke={BRANCO}
      strokeWidth="3"
    />
    <circle cx="36" cy="38" r="3" fill={BRANCO} />
    <circle cx="58" cy="30" r="3" fill={VERDE} />
    <circle cx="68" cy="44" r="3" fill={BRANCO} />
  </svg>
);

const Brilho: React.FC<{ tamanho: number; cor?: string }> = ({
  tamanho,
  cor = "#FFE45C",
}) => (
  <svg width={tamanho} height={tamanho} viewBox="0 0 24 24">
    <path
      d="M12 0 L14 10 L24 12 L14 14 L12 24 L10 14 L0 12 L10 10Z"
      fill={cor}
    />
  </svg>
);

const Moeda: React.FC<{ tamanho: number }> = ({ tamanho }) => (
  <svg width={tamanho} height={tamanho} viewBox="0 0 100 100">
    <circle
      cx="50"
      cy="50"
      r="44"
      fill="#FFC83D"
      stroke={BRANCO}
      strokeWidth="6"
    />
    <circle
      cx="50"
      cy="50"
      r="32"
      fill="none"
      stroke="#E0A21B"
      strokeWidth="5"
    />
    <text
      x="50"
      y="66"
      textAnchor="middle"
      fontSize="44"
      fontWeight="900"
      fill="#B07A0A"
      fontFamily="Montserrat"
    >
      $
    </text>
  </svg>
);

// ---------- Elementos que aparecem na tela ----------

// Balas flutuando ao redor (para "adoçar")
const BalasFlutuando: React.FC<{ quantidade?: number }> = ({
  quantidade = 7,
}) => {
  const frame = useCurrentFrame();
  const cores = [ROSA, VERDE, AZUL, "#FFB13B"];
  return (
    <AbsoluteFill>
      {new Array(quantidade).fill(0).map((_, i) => {
        const lado =
          i % 2 === 0
            ? 60 + random(`x${i}`) * 220
            : 760 + random(`x${i}`) * 220;
        const y0 = 220 + random(`y${i}`) * 900;
        const p = spring({
          frame: frame - i * 3,
          fps: FPS,
          config: { damping: 10 },
        });
        const sobe = Math.sin((frame + i * 20) / 12) * 18;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: lado,
              top: y0 + sobe,
              transform: `scale(${p}) rotate(${(random(`r${i}`) - 0.5) * 60 + frame}deg)`,
            }}
          >
            <Bala
              tamanho={110 + random(`t${i}`) * 50}
              cor={cores[i % cores.length]}
            />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// Chuva de doces (final)
const ChuvaDeDoces: React.FC = () => {
  const frame = useCurrentFrame();
  const cores = [ROSA, VERDE, AZUL, "#FFB13B"];
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {new Array(16).fill(0).map((_, i) => {
        const x = random(`cx${i}`) * 1000;
        const atraso = random(`cd${i}`) * 25;
        const y = -150 + (frame - atraso) * (14 + random(`cv${i}`) * 8);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              transform: `rotate(${frame * (4 + i)}deg)`,
            }}
          >
            {i % 3 === 0 ? (
              <Cupcake tamanho={110} />
            ) : (
              <Bala tamanho={110} cor={cores[i % 4]} />
            )}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// Selo grande com nome do evento
const SeloDoceEncantada: React.FC = () => {
  const p = useMola(0, 9);
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        top: 1440,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          position: "relative",
          background: ROSA,
          border: `8px solid ${BRANCO}`,
          borderRadius: 50,
          padding: "14px 40px",
          ...FONTE,
          color: BRANCO,
          fontSize: 64,
          lineHeight: 1,
          textAlign: "center",
          boxShadow: "0 18px 50px rgba(0,0,0,0.35)",
          transform: `scale(${p}) rotate(${-4 + Math.sin(frame / 10) * 2}deg)`,
        }}
      >
        A DOCE ENCANTADA
        <div style={{ fontSize: 40, marginTop: 6 }}>ESTÁ CHEGANDO!</div>
        {[
          [-40, -36, 60],
          [-30, 60, 40],
          [640, -40, 55],
          [660, 60, 40],
        ].map(([x, y, t], i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              transform: `scale(${0.6 + Math.abs(Math.sin((frame + i * 9) / 7)) * 0.6})`,
            }}
          >
            <Brilho tamanho={t} />
          </div>
        ))}
      </div>
    </div>
  );
};

// Etiqueta com ícone (lado da tela)
const Etiqueta: React.FC<{
  icone: React.ReactNode;
  linhas: React.ReactNode;
  topo: number;
  lado: "esquerda" | "direita";
  cor?: string;
}> = ({ icone, linhas, topo, lado, cor = AZUL }) => {
  const p = useMola(0, 10);
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        top: topo + Math.sin(frame / 9) * 8,
        [lado === "esquerda" ? "left" : "right"]: 40,
        display: "flex",
        alignItems: "center",
        gap: 18,
        background: BRANCO,
        borderRadius: 40,
        border: `6px solid ${cor}`,
        padding: "16px 34px 16px 16px",
        boxShadow: "0 16px 40px rgba(0,0,0,0.35)",
        ...FONTE,
        color: cor,
        fontSize: 48,
        lineHeight: 1.05,
        transform: `scale(${p}) rotate(${lado === "esquerda" ? -3 : 3}deg)`,
        transformOrigin: lado === "esquerda" ? "left center" : "right center",
      }}
    >
      {icone}
      <div>{linhas}</div>
    </div>
  );
};

// Calendário com a data
const Calendario: React.FC<{ tamanho: number }> = ({ tamanho }) => (
  <div
    style={{
      width: tamanho,
      height: tamanho * 1.05,
      borderRadius: tamanho * 0.14,
      background: BRANCO,
      overflow: "hidden",
      border: `6px solid ${AZUL}`,
      display: "flex",
      flexDirection: "column",
      ...FONTE,
      textAlign: "center",
    }}
  >
    <div
      style={{
        background: ROSA,
        color: BRANCO,
        fontSize: tamanho * 0.125,
        padding: "6px 0",
      }}
    >
      NOVEMBRO
    </div>
    <div
      style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: AZUL,
        fontSize: tamanho * 0.5,
      }}
    >
      27
    </div>
  </div>
);

// Data grande enquanto ela caminha
const DataGrande: React.FC = () => {
  const p = useMola(0, 9);
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        top: 150,
        left: 0,
        right: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 20,
        transform: `scale(${p})`,
        ...FONTE,
        color: BRANCO,
        textAlign: "center",
      }}
    >
      <div style={{ transform: `rotate(${Math.sin(frame / 8) * 4}deg)` }}>
        <Calendario tamanho={300} />
      </div>
      <div
        style={{
          fontSize: 64,
          WebkitTextStroke: "10px #10305C",
          paintOrder: "stroke fill",
        }}
      >
        SALVE ESSA <span style={{ color: ROSA }}>DATA!</span>
      </div>
    </div>
  );
};

// Tela final
const Final: React.FC = () => {
  const p = useMola(0, 11);
  const p2 = useMola(10, 9);
  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(160deg, rgba(28,95,184,${0.95 * p}), rgba(255,79,154,${0.92 * p}))`,
        alignItems: "center",
        justifyContent: "center",
        ...FONTE,
        color: BRANCO,
        textAlign: "center",
      }}
    >
      <div style={{ transform: `scale(${p})` }}>
        <Cupcake tamanho={220} />
      </div>
      <div style={{ fontSize: 50, marginTop: 20, opacity: p }}>A</div>
      <div style={{ fontSize: 104, lineHeight: 1, opacity: p }}>
        DOCE
        <br />
        ENCANTADA
      </div>
      <div style={{ marginTop: 50, transform: `scale(${p2})` }}>
        <Calendario tamanho={220} />
      </div>
      <div
        style={{ fontSize: 46, marginTop: 40, opacity: p2, lineHeight: 1.2 }}
      >
        PROJETO EDUCAÇÃO FINANCEIRA
        <br />
        <span style={{ color: "#FFE45C" }}>COLÉGIO DINÂMICO</span>
      </div>
    </AbsoluteFill>
  );
};

// ---------- Montagem ----------

const ELEMENTOS: {
  de: number;
  ate: number;
  som: "pop" | "whoosh";
  tela: React.ReactNode;
}[] = [
  // "adoçar o seu dia"
  { de: 2.4, ate: 3.6, som: "pop", tela: <BalasFlutuando /> },
  // "a Doce Encantada está chegando"
  { de: 5.2, ate: 7.3, som: "whoosh", tela: <SeloDoceEncantada /> },
  // "marca na agenda" — lado direito, na parede
  {
    de: 9.4,
    ate: 12.7,
    som: "pop",
    tela: (
      <Etiqueta
        icone={<Calendario tamanho={110} />}
        linhas={
          <>
            MARCA NA
            <br />
            <span style={{ color: ROSA }}>AGENDA</span>
          </>
        }
        topo={1130}
        lado="direita"
      />
    ),
  },
  // "experimentar nossas delícias"
  {
    de: 12.7,
    ate: 14.75,
    som: "pop",
    tela: (
      <Etiqueta
        icone={<Cupcake tamanho={110} />}
        linhas={
          <>
            NOSSAS
            <br />
            <span style={{ color: ROSA }}>DELÍCIAS</span>
          </>
        }
        topo={1130}
        lado="direita"
        cor={ROSA}
      />
    ),
  },
  // enquanto ela caminha até "no dia 27 de novembro"
  { de: 14.85, ate: 18.2, som: "whoosh", tela: <DataGrande /> },
  // "projeto Educação Financeira"
  {
    de: 18.4,
    ate: 21.6,
    som: "pop",
    tela: (
      <Etiqueta
        icone={<Moeda tamanho={110} />}
        linhas={
          <>
            PROJETO
            <br />
            <span style={{ color: VERDE }}>EDUCAÇÃO FINANCEIRA</span>
          </>
        }
        topo={300}
        lado="esquerda"
      />
    ),
  },
  // "vender docinhos deliciosos"
  { de: 21.9, ate: VIDEO_SEGUNDOS, som: "pop", tela: <ChuvaDeDoces /> },
];

export const DoceEncantada: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "black" }}>
    <Sequence durationInFrames={q(VIDEO_SEGUNDOS)}>
      <OffthreadVideo src={VIDEO} style={{ width: "100%", height: "100%" }} />
    </Sequence>

    {ELEMENTOS.map((e, i) => (
      <Sequence key={i} from={q(e.de)} durationInFrames={q(e.ate - e.de)}>
        {e.tela}
        <Audio src={staticFile(`novembro/${e.som}.wav`)} volume={0.55} />
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

    {/* Whoosh nos cortes de cena */}
    {[3.57, 9.13, 14.77].map((s) => (
      <Sequence key={s} from={q(s) - 4} durationInFrames={15}>
        <Audio src={staticFile("novembro/whoosh.wav")} volume={0.45} />
      </Sequence>
    ))}

    <Sequence from={q(VIDEO_SEGUNDOS)}>
      <Freeze frame={0}>
        <OffthreadVideo src={VIDEO} startFrom={q(VIDEO_SEGUNDOS) - 2} muted />
      </Freeze>
      <Final />
      <Audio src={staticFile("novembro/whoosh.wav")} volume={0.6} />
    </Sequence>
  </AbsoluteFill>
);
