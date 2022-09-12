import MDBox from "components/bases/MDBox";

export default function ImageCard({ image, width }: { image: string; width: number }) {
  return (
    <MDBox
      position="relative"
      borderRadius="lg"
      mt={-3}
      mx={`${(100 - width) / 2}%`}
      width={`${width}%`}
      style={{ aspectRatio: "1" }}
    >
      <MDBox
        component="img"
        src={image}
        alt=""
        borderRadius="lg"
        shadow="md"
        width="100%"
        height="100%"
        position="relative"
        zIndex={1}
      />
      <MDBox
        borderRadius="lg"
        shadow="md"
        width="100%"
        height="100%"
        position="absolute"
        left={0}
        top="3%"
        sx={{
          backgroundImage: `url(${image})`,
          transform: "scale(0.94)",
          filter: "blur(12px)",
          backgroundSize: "cover",
        }}
      />
    </MDBox>
  );
}
