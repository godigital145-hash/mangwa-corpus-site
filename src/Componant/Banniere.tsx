import Container from "./Container";

interface BanniereProps {
  imageUrl: string;
  titre: string;
}

export default function Banniere({ imageUrl, titre }: BanniereProps) {
  return (
    <section
      className="relative w-full h-[340px] sm:h-[420px] lg:h-[650px] bg-gray-300 overflow-hidden"
      style={{
        backgroundImage: imageUrl ? `url(${imageUrl})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >

      <Container className="relative h-full flex items-center pb-10 sm:pb-14">
        <h1 className="text-[28px] sm:text-[36px] lg:text-[64px] karma font-semibold text-black leading-tight max-w-[820px]">
          {titre}
        </h1>
      </Container>
    </section>
  );
}
