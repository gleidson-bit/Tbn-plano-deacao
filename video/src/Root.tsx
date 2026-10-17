import { Composition, staticFile } from "remotion";
import {
  CaptionedVideo,
  calculateCaptionedVideoMetadata,
  captionedVideoSchema,
} from "./CaptionedVideo";
import {
  SOLDA_DURACAO,
  SOLDA_DURACAO_NARRADO,
  SOLDA_OFERTA_DURACAO,
  SoldaOferta,
  SoldaTikTok,
} from "./SoldaTikTok";

// Each <Composition> is an entry in the sidebar!

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="CaptionedVideo"
        component={CaptionedVideo}
        calculateMetadata={calculateCaptionedVideoMetadata}
        schema={captionedVideoSchema}
        width={1080}
        height={1920}
        defaultProps={{
          src: staticFile("sample-video.mp4"),
        }}
      />
      <Composition
        id="SoldaTikTok"
        component={SoldaTikTok}
        durationInFrames={SOLDA_DURACAO}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="SoldaTikTokNarrado"
        component={SoldaTikTok}
        durationInFrames={SOLDA_DURACAO_NARRADO}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ narracao: true }}
      />
      <Composition
        id="SoldaOferta"
        component={SoldaOferta}
        durationInFrames={SOLDA_OFERTA_DURACAO}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
