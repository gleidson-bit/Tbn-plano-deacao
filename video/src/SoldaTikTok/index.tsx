import React from "react";
import {
  AbsoluteFill,
  Audio,
  cancelRender,
  continueRender,
  delayRender,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
// Fonte Montserrat salva em public/ (funciona sem internet na hora de gerar)
const fontFamily = "Montserrat";
const esperaFonte = delayRender("Carregando fonte");
const fonte = new FontFace(
  fontFamily,
  `url('${staticFile("montserrat-900.woff2")}') format('woff2')`,
  { weight: "900" },
);
fonte
  .load()
  .then(() => {
    document.fonts.add(fonte);
    continueRender(esperaFonte);
  })
  .catch((err) => cancelRender(err));

const FONTE = { fontFamily, fontWeight: 900 } as const;

// Tamanho original de cada foto (largura x altura)
const TAMANHOS: Record<string, [number, number]> = {
  "solda/1.jpg": [1320, 1155],
  "solda/2.jpg": [1067, 1253],
  "solda/3.jpg": [1320, 1188],
  "solda/4.jpg": [1320, 1167],
  "solda/5.jpg": [1320, 1205],
};

const AMARELO = "#FFE01B";
const PRETO = "#0B0B0B";
const LARANJA = "#FF6A00";

// Duração de cada cena em quadros (30 quadros = 1 segundo)
const CENAS = [90, 105, 120, 105, 90, 90];
// Com narração as cenas ficam mais longas, no tempo de cada fala
const CENAS_NARRADO = [112, 162, 188, 110, 120, 120];

const soma = (lista: number[]) => lista.reduce((a, b) => a + b, 0);
export const SOLDA_DURACAO = soma(CENAS);
export const SOLDA_DURACAO_NARRADO = soma(CENAS_NARRADO);

const useEntrada = (atraso = 0) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - atraso, fps, config: { damping: 14 } });
};

const Titulo: React.FC<{ linhas: string[]; destaque?: number }> = ({
  linhas,
  destaque = -1,
}) => {
  const p = useEntrada();
  return (
    <div
      style={{
        position: "absolute",
        top: 130,
        left: 60,
        right: 60,
        textAlign: "center",
        transform: `translateY(${interpolate(p, [0, 1], [-60, 0])}px)`,
        opacity: p,
      }}
    >
      {linhas.map((l, i) => (
        <div
          key={l}
          style={{
            ...FONTE,
            fontSize: 84,
            lineHeight: 1.05,
            color: i === destaque ? AMARELO : "white",
            textShadow: "0 6px 18px rgba(0,0,0,0.8)",
          }}
        >
          {l}
        </div>
      ))}
    </div>
  );
};

const Foto: React.FC<{ src: string }> = ({ src }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const p = useEntrada(4);
  const zoom = interpolate(frame, [0, durationInFrames], [1, 1.04]);
  const [w, h] = TAMANHOS[src];
  const escala = Math.min(960 / w, 940 / h);
  const largura = w * escala;
  const altura = h * escala;
  return (
    <>
      <AbsoluteFill>
        <Img
          src={staticFile(src)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "blur(40px) brightness(0.35)",
            transform: "scale(1.3)",
          }}
        />
      </AbsoluteFill>
      <div
        style={{
          position: "absolute",
          top: 950 - altura / 2,
          left: (1080 - largura) / 2,
          width: largura,
          height: altura,
          borderRadius: 40,
          overflow: "hidden",
          border: `8px solid ${AMARELO}`,
          boxShadow: "0 30px 80px rgba(0,0,0,0.6)",
          transform: `scale(${interpolate(p, [0, 1], [0.85, 1])})`,
          opacity: p,
        }}
      >
        <Img
          src={staticFile(src)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: `scale(${zoom})`,
          }}
        />
      </div>
    </>
  );
};

const Etiqueta: React.FC<{ texto: string; atraso: number }> = ({
  texto,
  atraso,
}) => {
  const p = useEntrada(atraso);
  return (
    <div
      style={{
        ...FONTE,
        fontSize: 44,
        background: AMARELO,
        color: PRETO,
        padding: "14px 30px",
        borderRadius: 20,
        transform: `scale(${p})`,
      }}
    >
      {texto}
    </div>
  );
};

const Rodape: React.FC<{ itens: string[]; inicioAtraso?: number }> = ({
  itens,
  inicioAtraso = 12,
}) => (
  <div
    style={{
      position: "absolute",
      top: 1470,
      left: 40,
      right: 40,
      display: "flex",
      flexWrap: "wrap",
      gap: 18,
      justifyContent: "center",
    }}
  >
    {itens.map((t, i) => (
      <Etiqueta key={t} texto={t} atraso={inicioAtraso + i * 8} />
    ))}
  </div>
);

// Selo laranja piscando no canto da foto (ex.: "PREÇO PROMOCIONAL")
const Selo: React.FC<{ texto: string }> = ({ texto }) => {
  const frame = useCurrentFrame();
  const p = useEntrada(10);
  const pulso = 1 + Math.sin(frame / 4) * 0.05;
  return (
    <div
      style={{
        position: "absolute",
        top: 430,
        right: 30,
        ...FONTE,
        fontSize: 46,
        lineHeight: 1.05,
        textAlign: "center",
        background: LARANJA,
        color: "white",
        padding: "18px 28px",
        borderRadius: 24,
        border: `5px solid ${PRETO}`,
        boxShadow: "0 12px 30px rgba(0,0,0,0.5)",
        transform: `rotate(6deg) scale(${p * pulso})`,
        whiteSpace: "pre-line",
      }}
    >
      {texto}
    </div>
  );
};

const Cena: React.FC<{
  img: string;
  titulo: string[];
  destaque?: number;
  itens: string[];
  selo?: string;
}> = ({ img, titulo, destaque, itens, selo }) => (
  <AbsoluteFill style={{ backgroundColor: PRETO }}>
    <Foto src={img} />
    <Titulo linhas={titulo} destaque={destaque} />
    {selo ? <Selo texto={selo} /> : null}
    <Rodape itens={itens} />
  </AbsoluteFill>
);

const Final: React.FC = () => {
  const p = useEntrada();
  const p2 = useEntrada(15);
  const frame = useCurrentFrame();
  const pulso = 1 + Math.sin(frame / 5) * 0.04;
  return (
    <AbsoluteFill
      style={{
        backgroundColor: AMARELO,
        alignItems: "center",
        justifyContent: "center",
        ...FONTE,
        color: PRETO,
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontSize: 130,
          background: PRETO,
          color: AMARELO,
          padding: "10px 50px",
          borderRadius: 24,
          transform: `scale(${p})`,
        }}
      >
        BOMVINK
      </div>
      <Img
        src={staticFile("solda/5.jpg")}
        style={{
          width: 620,
          height: 620,
          objectFit: "cover",
          borderRadius: "50%",
          margin: "50px 0",
          border: `10px solid ${PRETO}`,
          transform: `scale(${p})`,
        }}
      />
      <div style={{ fontSize: 96, lineHeight: 1.05, opacity: p }}>
        FIO DE SOLDA
        <br />
        1MM · 40G
      </div>
      <div
        style={{
          marginTop: 60,
          fontSize: 60,
          lineHeight: 1.1,
          background: LARANJA,
          color: "white",
          padding: "24px 50px",
          borderRadius: 40,
          border: `6px solid ${PRETO}`,
          display: "flex",
          alignItems: "center",
          gap: 30,
          textAlign: "left",
          transform: `scale(${p2 * pulso})`,
        }}
      >
        {/* Ícone de carrinho de compras */}
        <svg width="110" height="110" viewBox="0 0 24 24" fill="white">
          <path d="M7 18a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm10 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM1 2v2h2l3.6 7.59-1.35 2.44C4.52 15.37 5.48 17 7 17h12v-2H7l1.1-2h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1Z" />
        </svg>
        <div>
          LINK NO
          <br />
          CARRINHO LARANJA
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const SoldaTikTok: React.FC<{ narracao?: boolean }> = ({
  narracao = false,
}) => {
  const duracoes = narracao ? CENAS_NARRADO : CENAS;
  const cenas = [
    <Cena
      img="solda/2.jpg"
      titulo={["SUA SOLDA", "NÃO PEGA", "NA PLACA?"]}
      destaque={1}
      itens={["O PROBLEMA PODE SER O FIO"]}
    />,
    <Cena
      img="solda/5.jpg"
      titulo={["FIO DE SOLDA", "BOMVINK"]}
      destaque={1}
      itens={["ESTANHO 40%", "1 MM", "40 G"]}
    />,
    <Cena
      img="solda/4.jpg"
      titulo={["FLUXO JÁ VEM", "DENTRO DO FIO"]}
      destaque={1}
      itens={["MENOS FUMAÇA", "ESPESSURA UNIFORME", "RESISTE À CORROSÃO"]}
    />,
    <Cena
      img="solda/1.jpg"
      titulo={["SERVE PARA", "VÁRIOS USOS"]}
      destaque={1}
      itens={["PLACAS", "ELETRÔNICOS", "REPAROS", "PROJETOS"]}
    />,
    <Cena
      img="solda/3.jpg"
      titulo={["DO CONSERTO", "AO PROJETO", "EM CASA"]}
      destaque={2}
      itens={["SOLDA FIRME E DURADOURA"]}
    />,
    <Final />,
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: PRETO }}>
      {cenas.map((c, i) => (
        <Sequence
          key={i}
          from={soma(duracoes.slice(0, i))}
          durationInFrames={duracoes[i]}
        >
          {c}
          {narracao ? (
            <Sequence from={6}>
              <Audio src={staticFile(`narracao/${i + 1}.wav`)} volume={1.7} />
            </Sequence>
          ) : null}
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

// Versão para a missão do TikTok Shop: oferta, urgência, benefícios e chamada
const CENAS_OFERTA = [142, 127, 170, 168, 147, 149, 185];
export const SOLDA_OFERTA_DURACAO = soma(CENAS_OFERTA);

const FinalOferta: React.FC = () => {
  const p = useEntrada();
  const p2 = useEntrada(12);
  const frame = useCurrentFrame();
  const pulso = 1 + Math.sin(frame / 5) * 0.04;
  const pulo = Math.abs(Math.sin(frame / 6)) * 40;
  return (
    <AbsoluteFill
      style={{
        backgroundColor: AMARELO,
        alignItems: "center",
        paddingTop: 150,
        ...FONTE,
        color: PRETO,
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontSize: 110,
          background: PRETO,
          color: AMARELO,
          padding: "10px 50px",
          borderRadius: 24,
          transform: `scale(${p})`,
        }}
      >
        BOMVINK
      </div>
      <Img
        src={staticFile("solda/5.jpg")}
        style={{
          width: 520,
          height: 520,
          objectFit: "cover",
          borderRadius: "50%",
          margin: "40px 0 30px",
          border: `10px solid ${PRETO}`,
          transform: `scale(${p})`,
        }}
      />
      <div style={{ fontSize: 80, lineHeight: 1.05, opacity: p }}>
        PREÇO PROMOCIONAL
      </div>
      <div
        style={{
          fontSize: 48,
          marginTop: 16,
          background: PRETO,
          color: "white",
          padding: "8px 30px",
          borderRadius: 14,
          opacity: p,
        }}
      >
        SÓ ENQUANTO DURAR O ESTOQUE
      </div>
      <div
        style={{
          marginTop: 50,
          fontSize: 60,
          lineHeight: 1.1,
          background: LARANJA,
          color: "white",
          padding: "24px 50px",
          borderRadius: 40,
          border: `6px solid ${PRETO}`,
          display: "flex",
          alignItems: "center",
          gap: 30,
          textAlign: "left",
          transform: `scale(${p2 * pulso})`,
        }}
      >
        <svg width="110" height="110" viewBox="0 0 24 24" fill="white">
          <path d="M7 18a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm10 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM1 2v2h2l3.6 7.59-1.35 2.44C4.52 15.37 5.48 17 7 17h12v-2H7l1.1-2h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1Z" />
        </svg>
        <div>
          TOQUE NO
          <br />
          CARRINHO LARANJA
        </div>
      </div>
      {/* Seta pulando para baixo, apontando para o link do produto */}
      <svg
        width="130"
        height="130"
        viewBox="0 0 24 24"
        fill={PRETO}
        style={{
          marginTop: 20,
          transform: `translateY(${pulo}px)`,
          opacity: p2,
        }}
      >
        <path d="M11 4h2v12l5.5-5.5 1.42 1.42L12 19.84l-7.92-7.92L5.5 10.5 11 16V4Z" />
      </svg>
    </AbsoluteFill>
  );
};

export const SoldaOferta: React.FC = () => {
  const cenas = [
    <Cena
      img="solda/5.jpg"
      titulo={["FIO DE SOLDA", "COM PREÇO", "PROMOCIONAL!"]}
      destaque={2}
      itens={["APROVEITE AGORA"]}
      selo={"OFERTA\nBOMVINK"}
    />,
    <Cena
      img="solda/4.jpg"
      titulo={["CORRE!", "ESTOQUE LIMITADO"]}
      destaque={0}
      itens={["SÓ ENQUANTO DURAR", "ACABOU, ACABOU"]}
      selo={"OFERTA\nLIMITADA"}
    />,
    <Cena
      img="solda/2.jpg"
      titulo={["FLUXO JÁ VEM", "DENTRO DO FIO"]}
      destaque={1}
      itens={["ESCORRE FÁCIL", "GRUDA FIRME", "MENOS FUMAÇA"]}
    />,
    <Cena
      img="solda/5.jpg"
      titulo={["1 MM · 40 G", "ESPESSURA UNIFORME"]}
      destaque={0}
      itens={["RESISTE À CORROSÃO", "ESTANHO 40%"]}
    />,
    <Cena
      img="solda/1.jpg"
      titulo={["SERVE PARA", "VÁRIOS USOS"]}
      destaque={1}
      itens={["PLACAS", "ELETRÔNICOS", "REPAROS", "PROJETOS"]}
    />,
    <Cena
      img="solda/3.jpg"
      titulo={["SOLDA FIRME", "E DURADOURA"]}
      destaque={1}
      itens={["DO CONSERTO AO PROJETO"]}
    />,
    <FinalOferta />,
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: PRETO }}>
      {cenas.map((c, i) => (
        <Sequence
          key={i}
          from={soma(CENAS_OFERTA.slice(0, i))}
          durationInFrames={CENAS_OFERTA[i]}
        >
          {c}
          <Sequence from={6}>
            <Audio
              src={staticFile(`narracao-oferta/${i + 1}.wav`)}
              volume={1.7}
            />
          </Sequence>
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
