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
const AZUL_CLARO = "#1B4A6B";
const BRANCO = "#FFFFFF";

// Dados do Google Maps (print enviado em 05/11/2026)
const NOTA = 4.7;
const AVALIACOES = "+200 AVALIAÇÕES";
const WHATSAPP = "(64) 99283-4153";

// Duração de cada cena em quadros (30 quadros = 1 segundo), no tempo da narração
const CENAS = [165, 210, 101, 129, 100, 125, 186];
// Narração de cada cena, na mesma ordem
const AUDIOS = ["1", "depoimentos", "2", "3", "4", "5", "6"];

// Trechos de avaliações reais do Google (só o primeiro nome e a inicial)
const DEPOIMENTOS = [
  {
    texto:
      "Foi muito rápido o atendimento e a instalação. A internet é ótima. Super indico.",
    nome: "Wennia C.",
  },
  {
    texto:
      "Fechei contrato hoje com a empresa! O atendimento foi desenrolado e ágil.",
    nome: "Robson O.",
  },
  {
    texto:
      "Internet perfeita, muito rápida e com o ping muito baixo e estável.",
    nome: "Roberto F.",
  },
];
const soma = (l: number[]) => l.reduce((a, b) => a + b, 0);
export const TBN_AVALIACAO_DURACAO = soma(CENAS);

const useEntrada = (atraso = 0, damping = 13) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - atraso, fps, config: { damping } });
};

const Fundo: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% ${40 + Math.sin(frame / 40) * 5}%, ${AZUL_CLARO} 0%, ${AZUL} 65%)`,
      }}
    />
  );
};

const Logo: React.FC<{ largura?: number; topo?: number }> = ({
  largura = 340,
  topo = 140,
}) => (
  <Img
    src={staticFile("tbn/logo-branca.png")}
    style={{
      position: "absolute",
      top: topo,
      left: (1080 - largura) / 2,
      width: largura,
    }}
  />
);

const Texto: React.FC<{
  children: React.ReactNode;
  tamanho: number;
  topo: number;
  atraso?: number;
  cor?: string;
}> = ({ children, tamanho, topo, atraso = 0, cor = BRANCO }) => {
  const p = useEntrada(atraso);
  return (
    <div
      style={{
        position: "absolute",
        top: topo,
        left: 50,
        right: 50,
        textAlign: "center",
        ...FONTE,
        fontSize: tamanho,
        lineHeight: 1.08,
        color: cor,
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [50, 0])}px)`,
      }}
    >
      {children}
    </div>
  );
};

const Etiqueta: React.FC<{
  children: React.ReactNode;
  atraso: number;
  fundo?: string;
  cor?: string;
  tamanho?: number;
}> = ({ children, atraso, fundo = LARANJA, cor = BRANCO, tamanho = 50 }) => {
  const p = useEntrada(atraso, 11);
  return (
    <div
      style={{
        ...FONTE,
        fontSize: tamanho,
        background: fundo,
        color: cor,
        padding: "14px 34px",
        borderRadius: 999,
        transform: `scale(${p})`,
      }}
    >
      {children}
    </div>
  );
};

const CAMINHO_ESTRELA =
  "M12 2l2.95 6.6 7.05.65-5.33 4.7 1.58 6.95L12 17.3l-6.25 3.6 1.58-6.95L2 9.25l7.05-.65L12 2z";

// Estrela que se preenche (fração de 0 a 1)
const Estrela: React.FC<{ fracao: number; tamanho: number; id: string }> = ({
  fracao,
  tamanho,
  id,
}) => (
  <svg width={tamanho} height={tamanho} viewBox="0 0 24 24">
    <defs>
      <clipPath id={id}>
        <rect x="0" y="0" width={24 * fracao} height="24" />
      </clipPath>
    </defs>
    <path d={CAMINHO_ESTRELA} fill="rgba(255,255,255,0.18)" />
    <path d={CAMINHO_ESTRELA} fill="#FFC107" clipPath={`url(#${id})`} />
  </svg>
);

const Estrelas: React.FC<{ tamanho: number; atraso: number }> = ({
  tamanho,
  atraso,
}) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{ display: "flex", gap: tamanho * 0.12, justifyContent: "center" }}
    >
      {[0, 1, 2, 3, 4].map((i) => {
        const cheia = Math.min(1, Math.max(0, NOTA - i));
        const enche = interpolate(
          frame,
          [atraso + i * 6, atraso + i * 6 + 8],
          [0, cheia],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          },
        );
        return (
          <Estrela
            key={i}
            fracao={enche}
            tamanho={tamanho}
            id={`e${tamanho}-${i}`}
          />
        );
      })}
    </div>
  );
};

// Cena 1: a nota no Google
const CenaNota: React.FC = () => {
  const frame = useCurrentFrame();
  const valor = interpolate(frame, [8, 45], [0, NOTA], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const p = useEntrada(4, 10);
  return (
    <AbsoluteFill>
      <Fundo />
      <Logo />
      <Texto tamanho={64} topo={430}>
        NOTA NO <span style={{ color: LARANJA }}>GOOGLE</span>
      </Texto>
      <div
        style={{
          position: "absolute",
          top: 520,
          width: "100%",
          textAlign: "center",
          ...FONTE,
          fontSize: 360,
          color: BRANCO,
          transform: `scale(${p})`,
          textShadow: "0 20px 60px rgba(0,0,0,0.45)",
        }}
      >
        {valor.toFixed(1).replace(".", ",")}
      </div>
      <div style={{ position: "absolute", top: 940, width: "100%" }}>
        <Estrelas tamanho={150} atraso={20} />
      </div>
      <div
        style={{
          position: "absolute",
          top: 1160,
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Etiqueta atraso={55} tamanho={46}>
          {AVALIACOES} DE CLIENTES
        </Etiqueta>
      </div>
    </AbsoluteFill>
  );
};

const CartaoDepoimento: React.FC<{
  texto: string;
  nome: string;
  atraso: number;
  topo: number;
}> = ({ texto, nome, atraso, topo }) => {
  const p = useEntrada(atraso, 12);
  return (
    <div
      style={{
        position: "absolute",
        top: topo,
        left: 60,
        right: 60,
        background: BRANCO,
        borderRadius: 32,
        padding: "30px 40px",
        boxShadow: "0 18px 50px rgba(0,0,0,0.45)",
        opacity: p,
        transform: `translateX(${interpolate(p, [0, 1], [300, 0])}px)`,
      }}
    >
      <div style={{ display: "flex", gap: 6 }}>
        {[0, 1, 2, 3, 4].map((i) => (
          <svg key={i} width="44" height="44" viewBox="0 0 24 24">
            <path d={CAMINHO_ESTRELA} fill="#FFC107" />
          </svg>
        ))}
      </div>
      <div
        style={{
          fontFamily: FONTE.fontFamily,
          fontWeight: 900,
          fontSize: 40,
          lineHeight: 1.25,
          color: AZUL,
          marginTop: 14,
        }}
      >
        “{texto}”
      </div>
      <div
        style={{
          ...FONTE,
          fontSize: 32,
          color: LARANJA,
          marginTop: 14,
        }}
      >
        {nome} · AVALIAÇÃO NO GOOGLE
      </div>
    </div>
  );
};

// Cena: o que os clientes dizem
const CenaDepoimentos: React.FC = () => (
  <AbsoluteFill>
    <Fundo />
    <Logo />
    <Texto tamanho={60} topo={300}>
      O QUE OS <span style={{ color: LARANJA }}>CLIENTES</span> DIZEM
    </Texto>
    {DEPOIMENTOS.map((d, i) => (
      <CartaoDepoimento
        key={d.nome}
        texto={d.texto}
        nome={d.nome}
        atraso={10 + i * 40}
        topo={[430, 790, 1100][i]}
      />
    ))}
  </AbsoluteFill>
);

// Cena 2: "não é por acaso"
const CenaAcaso: React.FC = () => (
  <AbsoluteFill>
    <Fundo />
    <Logo />
    <Texto tamanho={120} topo={620}>
      E NÃO É
      <br />
      <span style={{ color: LARANJA }}>POR ACASO</span>
    </Texto>
    <Texto tamanho={58} topo={960} atraso={20}>
      OLHA O QUE A TBN ENTREGA
    </Texto>
  </AbsoluteFill>
);

// Cartão de vantagem com ícone em cima
const Vantagem: React.FC<{
  icone: React.ReactNode;
  linhas: React.ReactNode;
  apoio: string;
}> = ({ icone, linhas, apoio }) => {
  const p = useEntrada(0, 11);
  return (
    <AbsoluteFill>
      <Fundo />
      <Logo />
      <div
        style={{
          position: "absolute",
          top: 520,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          transform: `scale(${p})`,
        }}
      >
        {icone}
      </div>
      <Texto tamanho={110} topo={940} atraso={6}>
        {linhas}
      </Texto>
      <Texto tamanho={52} topo={1200} atraso={18} cor="#BFD3E6">
        {apoio}
      </Texto>
    </AbsoluteFill>
  );
};

// Ícone: cabo com um ponto de luz correndo
const IconeFibra: React.FC = () => {
  const frame = useCurrentFrame();
  const x = ((frame * 14) % 640) + 20;
  return (
    <svg width="680" height="340" viewBox="0 0 680 340">
      <path
        d="M20 260 C 180 260, 200 80, 340 80 S 500 260, 660 260"
        stroke="rgba(255,255,255,0.25)"
        strokeWidth="26"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M20 260 C 180 260, 200 80, 340 80 S 500 260, 660 260"
        stroke={LARANJA}
        strokeWidth="10"
        fill="none"
        strokeLinecap="round"
        strokeDasharray="60 700"
        strokeDashoffset={-x}
        style={{ filter: `drop-shadow(0 0 18px ${LARANJA})` }}
      />
    </svg>
  );
};

// Ícone: relógio com ponteiro girando
const IconeRelogio: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <svg width="340" height="340" viewBox="0 0 100 100">
      <circle
        cx="50"
        cy="50"
        r="44"
        fill="none"
        stroke={BRANCO}
        strokeWidth="6"
      />
      <line
        x1="50"
        y1="50"
        x2="50"
        y2="20"
        stroke={LARANJA}
        strokeWidth="6"
        strokeLinecap="round"
        transform={`rotate(${frame * 12} 50 50)`}
      />
      <line
        x1="50"
        y1="50"
        x2="70"
        y2="50"
        stroke={BRANCO}
        strokeWidth="6"
        strokeLinecap="round"
        transform={`rotate(${frame * 1} 50 50)`}
      />
      <circle cx="50" cy="50" r="5" fill={LARANJA} />
    </svg>
  );
};

// Cena 5: empresa daqui, com foto da sede
const CenaDaqui: React.FC = () => {
  const p = useEntrada(0, 12);
  return (
    <AbsoluteFill>
      <Fundo />
      <Logo />
      <Img
        src={staticFile("tbn/sede.jpg")}
        style={{
          position: "absolute",
          top: 400,
          left: 140,
          width: 800,
          height: 404,
          objectFit: "cover",
          borderRadius: 32,
          border: `8px solid ${LARANJA}`,
          transform: `scale(${p}) rotate(-2deg)`,
          boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
        }}
      />
      <Texto tamanho={92} topo={880} atraso={6}>
        ATENDIMENTO DE
        <br />
        <span style={{ color: LARANJA }}>QUEM É DAQUI</span>
      </Texto>
      <div
        style={{
          position: "absolute",
          top: 1130,
          left: 40,
          right: 40,
          display: "flex",
          flexWrap: "wrap",
          gap: 18,
          justifyContent: "center",
        }}
      >
        <Etiqueta atraso={22} tamanho={46}>
          JATAÍ
        </Etiqueta>
        <Etiqueta atraso={30} tamanho={46}>
          PEROLÂNDIA
        </Etiqueta>
        <Etiqueta atraso={38} tamanho={46}>
          APORÉ
        </Etiqueta>
      </div>
    </AbsoluteFill>
  );
};

// Cena 6: chamada para o WhatsApp
const CenaFinal: React.FC = () => {
  const frame = useCurrentFrame();
  const p = useEntrada(14, 10);
  const pulso = 1 + Math.sin(frame / 5) * 0.035;
  return (
    <AbsoluteFill>
      <Fundo />
      <Logo largura={560} topo={260} />
      <div style={{ position: "absolute", top: 560, width: "100%" }}>
        <Estrelas tamanho={80} atraso={0} />
      </div>
      <Texto tamanho={38} topo={680} cor="#BFD3E6">
        NOTA 4,7 NO GOOGLE · {AVALIACOES}
      </Texto>
      <Texto tamanho={70} topo={800} atraso={6}>
        CONFIRA A COBERTURA
        <br />
        NO SEU <span style={{ color: LARANJA }}>ENDEREÇO</span>
      </Texto>
      <div
        style={{
          position: "absolute",
          top: 1020,
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
            gap: 24,
            ...FONTE,
            fontSize: 60,
            color: BRANCO,
            background: LARANJA,
            padding: "26px 46px",
            borderRadius: 999,
            boxShadow: `0 0 50px ${LARANJA}88`,
            transform: `scale(${p * pulso})`,
          }}
        >
          {/* Balão de conversa */}
          <svg width="80" height="80" viewBox="0 0 24 24" fill={BRANCO}>
            <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18a8 8 0 0 1-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1 1 12 20Zm4.4-6c-.2-.1-1.4-.7-1.7-.8-.2-.1-.4-.1-.5.1l-.8.9c-.1.2-.3.2-.5.1a6.6 6.6 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.5-.4h-.5a.9.9 0 0 0-.6.3 2.7 2.7 0 0 0-.9 2c0 1.2.9 2.4 1 2.5.1.2 1.8 2.7 4.3 3.8 1.6.7 2.2.7 3 .6.5-.1 1.4-.6 1.6-1.1.2-.6.2-1 .1-1.1l-.6-.4Z" />
          </svg>
          {WHATSAPP}
        </div>
      </div>
      <Texto tamanho={46} topo={1210} atraso={24}>
        CHAMA NO WHATSAPP
      </Texto>
    </AbsoluteFill>
  );
};

export const TbnAvaliacao: React.FC = () => {
  const cenas = [
    <CenaNota />,
    <CenaDepoimentos />,
    <CenaAcaso />,
    <Vantagem
      icone={<IconeFibra />}
      linhas={
        <>
          <span style={{ color: LARANJA }}>100%</span>
          <br />
          FIBRA ÓPTICA
        </>
      }
      apoio="ATÉ DENTRO DA SUA CASA"
    />,
    <Vantagem
      icone={<IconeRelogio />}
      linhas={
        <>
          INSTALAÇÃO
          <br />
          EM ATÉ <span style={{ color: LARANJA }}>24H</span>
        </>
      }
      apoio="PEDIU HOJE, NAVEGA AMANHÃ"
    />,
    <CenaDaqui />,
    <CenaFinal />,
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: AZUL }}>
      {cenas.map((c, i) => (
        <Sequence
          key={i}
          from={soma(CENAS.slice(0, i))}
          durationInFrames={CENAS[i]}
        >
          {c}
          <Sequence from={6}>
            <Audio
              src={staticFile(`narracao-tbn/${AUDIOS[i]}.wav`)}
              volume={1.7}
            />
          </Sequence>
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
