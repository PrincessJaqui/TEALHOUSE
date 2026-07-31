import svgPaths from "./svg-6ki8q7vz6k";
import imgImageAriaMule from "figma:asset/976c6f4331a9dda72f56be955dd1c4ecb56adaf1.png";
import imgImageLunaLaceSandal from "figma:asset/e316c939477cc751a3ac939840c2e2ccd59a9c14.png";
import imgImageChelseaBoot from "figma:asset/246b9d8fe6e703cde2f73ff5cb74cc75cc305526.png";
import imgImageTStrapPump from "figma:asset/f138a65da7a6e9f043be0c47845bd21d6bd609bc.png";
import imgImageAnkleStrapPump from "figma:asset/2235d82b895aa68409c43198232f934524e547bc.png";
import imgImageStilettoPump from "figma:asset/d2e49d5e5c2e04a8493f862414b39a5eaeb56d5c.png";
import imgImageSienaAnkleBoot from "figma:asset/a70555e6e7e71d5f6dfe8dee06578115e54236e1.png";
import imgImageVeneziaPlatformSandal from "figma:asset/82250d7c2a662535c689d294c1d1f7e6f4833d3c.png";
import imgImageMilanoOverTheKneeBoot from "figma:asset/f841642b7dd2889c285ccf4c098c6a236b820962.png";
import imgImageTealhouse from "figma:asset/3f298acd9128513aa329c386495f656e449305d1.png";

function Heading() {
  return (
    <div className="absolute h-[36.398px] left-[132px] top-[74px] w-[896px]" data-name="Heading 2">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[36.4px] left-[448px] not-italic text-[28px] text-black text-center text-nowrap top-0 tracking-[1px] translate-x-[-50%] uppercase whitespace-pre">Timeless Collection</p>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="absolute h-[44.797px] left-[300px] top-[123px] w-[560px]" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[22.4px] left-[280.14px] not-italic text-[#666666] text-[14px] text-center top-[0.5px] tracking-[-0.1504px] translate-x-[-50%] w-[550px]">Exquisite handcrafted designs for the new season. TEALHOUSE celebrates the magic of Italian artistry through delicate creations.</p>
    </div>
  );
}

function Hero() {
  return (
    <div className="bg-white h-[242px] relative shrink-0 w-full" data-name="Hero">
      <Heading />
      <Paragraph />
    </div>
  );
}

function ImageAriaMule() {
  return (
    <div className="h-[332.188px] relative shrink-0 w-full" data-name="Image (Aria Mule)">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImageAriaMule} />
    </div>
  );
}

function Container() {
  return (
    <div className="content-stretch flex flex-col h-[332.188px] items-start overflow-clip relative shrink-0 w-full" data-name="Container">
      <ImageAriaMule />
    </div>
  );
}

function Heading1() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Heading 3">
      <p className="absolute font-['Tinos:Regular',sans-serif] leading-[21px] left-0 not-italic text-[15px] text-black text-nowrap top-[-1px] tracking-[0.15px] whitespace-pre">Aria Mule</p>
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Light',sans-serif] font-light leading-[24px] left-0 not-italic text-[#666666] text-[15px] top-0 tracking-[-0.2344px] w-[47px]">$1,450</p>
    </div>
  );
}

function Container1() {
  return (
    <div className="content-stretch flex flex-col h-[45px] items-start relative shrink-0 w-full" data-name="Container">
      <Heading1 />
      <Paragraph1 />
    </div>
  );
}

function ProductCard() {
  return (
    <div className="absolute content-stretch flex flex-col h-[377.188px] items-start left-0 top-[25px] w-[265.75px]" data-name="ProductCard">
      <Container />
      <Container1 />
    </div>
  );
}

function ImageLunaLaceSandal() {
  return (
    <div className="h-[332.188px] relative shrink-0 w-full" data-name="Image (Luna Lace Sandal)">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImageLunaLaceSandal} />
    </div>
  );
}

function Container2() {
  return (
    <div className="content-stretch flex flex-col h-[332.188px] items-start overflow-clip relative shrink-0 w-full" data-name="Container">
      <ImageLunaLaceSandal />
    </div>
  );
}

function Heading3() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Heading 3">
      <p className="absolute font-['Tinos:Regular',sans-serif] leading-[21px] left-0 not-italic text-[15px] text-black text-nowrap top-[-1px] tracking-[0.15px] whitespace-pre">Luna Lace Sandal</p>
    </div>
  );
}

function Paragraph2() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Light',sans-serif] font-light leading-[24px] left-0 not-italic text-[#666666] text-[15px] top-0 tracking-[-0.2344px] w-[47px]">$1,280</p>
    </div>
  );
}

function Container3() {
  return (
    <div className="content-stretch flex flex-col h-[45px] items-start relative shrink-0 w-full" data-name="Container">
      <Heading3 />
      <Paragraph2 />
    </div>
  );
}

function ProductCard1() {
  return (
    <div className="absolute content-stretch flex flex-col h-[377.188px] items-start left-[297.75px] top-[25px] w-[265.75px]" data-name="ProductCard">
      <Container2 />
      <Container3 />
    </div>
  );
}

function ImageChelseaBoot() {
  return (
    <div className="h-[332.188px] relative shrink-0 w-full" data-name="Image (Chelsea Boot)">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImageChelseaBoot} />
    </div>
  );
}

function Container4() {
  return (
    <div className="content-stretch flex flex-col h-[332.188px] items-start overflow-clip relative shrink-0 w-full" data-name="Container">
      <ImageChelseaBoot />
    </div>
  );
}

function Heading4() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Heading 3">
      <p className="absolute font-['Tinos:Regular',sans-serif] leading-[21px] left-0 not-italic text-[15px] text-black text-nowrap top-[-1px] tracking-[0.15px] whitespace-pre">Chelsea Boot</p>
    </div>
  );
}

function Paragraph3() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Light',sans-serif] font-light leading-[24px] left-0 not-italic text-[#666666] text-[15px] top-0 tracking-[-0.2344px] w-[47px]">$1,680</p>
    </div>
  );
}

function Container5() {
  return (
    <div className="content-stretch flex flex-col h-[45px] items-start relative shrink-0 w-full" data-name="Container">
      <Heading4 />
      <Paragraph3 />
    </div>
  );
}

function ProductCard2() {
  return (
    <div className="absolute content-stretch flex flex-col h-[377.188px] items-start left-[595.5px] top-[25px] w-[265.75px]" data-name="ProductCard">
      <Container4 />
      <Container5 />
    </div>
  );
}

function ImageTStrapPump() {
  return (
    <div className="h-[332.188px] relative shrink-0 w-full" data-name="Image (T-Strap Pump)">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImageTStrapPump} />
    </div>
  );
}

function Container6() {
  return (
    <div className="content-stretch flex flex-col h-[332.188px] items-start overflow-clip relative shrink-0 w-full" data-name="Container">
      <ImageTStrapPump />
    </div>
  );
}

function Heading5() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Heading 3">
      <p className="absolute font-['Tinos:Regular',sans-serif] leading-[21px] left-0 not-italic text-[15px] text-black text-nowrap top-[-1px] tracking-[0.15px] whitespace-pre">T-Strap Pump</p>
    </div>
  );
}

function Paragraph4() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Light',sans-serif] font-light leading-[24px] left-0 not-italic text-[#666666] text-[15px] top-0 tracking-[-0.2344px] w-[45px]">$1,750</p>
    </div>
  );
}

function Container7() {
  return (
    <div className="content-stretch flex flex-col h-[45px] items-start relative shrink-0 w-full" data-name="Container">
      <Heading5 />
      <Paragraph4 />
    </div>
  );
}

function ProductCard3() {
  return (
    <div className="absolute content-stretch flex flex-col h-[377.188px] items-start left-[893.25px] top-[25px] w-[265.75px]" data-name="ProductCard">
      <Container6 />
      <Container7 />
    </div>
  );
}

function ImageAnkleStrapPump() {
  return (
    <div className="h-[332.188px] relative shrink-0 w-full" data-name="Image (Ankle Strap Pump)">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImageAnkleStrapPump} />
    </div>
  );
}

function Container8() {
  return (
    <div className="content-stretch flex flex-col h-[332.188px] items-start overflow-clip relative shrink-0 w-full" data-name="Container">
      <ImageAnkleStrapPump />
    </div>
  );
}

function Heading6() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Heading 3">
      <p className="absolute font-['Tinos:Regular',sans-serif] leading-[21px] left-0 not-italic text-[15px] text-black text-nowrap top-[-1px] tracking-[0.15px] whitespace-pre">Ankle Strap Pump</p>
    </div>
  );
}

function Paragraph5() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Light',sans-serif] font-light leading-[24px] left-0 not-italic text-[#666666] text-[15px] top-0 tracking-[-0.2344px] w-[47px]">$1,600</p>
    </div>
  );
}

function Container9() {
  return (
    <div className="content-stretch flex flex-col h-[45px] items-start relative shrink-0 w-full" data-name="Container">
      <Heading6 />
      <Paragraph5 />
    </div>
  );
}

function ProductCard4() {
  return (
    <div className="absolute content-stretch flex flex-col h-[377.188px] items-start left-0 top-[482.19px] w-[265.75px]" data-name="ProductCard">
      <Container8 />
      <Container9 />
    </div>
  );
}

function ImageStilettoPump() {
  return (
    <div className="h-[332.188px] relative shrink-0 w-full" data-name="Image (Stiletto Pump)">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImageStilettoPump} />
    </div>
  );
}

function Container10() {
  return (
    <div className="content-stretch flex flex-col h-[332.188px] items-start overflow-clip relative shrink-0 w-full" data-name="Container">
      <ImageStilettoPump />
    </div>
  );
}

function Heading7() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Heading 3">
      <p className="absolute font-['Tinos:Regular',sans-serif] leading-[21px] left-0 not-italic text-[15px] text-black text-nowrap top-[-1px] tracking-[0.15px] whitespace-pre">Stiletto Pump</p>
    </div>
  );
}

function Paragraph6() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Light',sans-serif] font-light leading-[24px] left-0 not-italic text-[#666666] text-[15px] top-0 tracking-[-0.2344px] w-[47px]">$1,900</p>
    </div>
  );
}

function Container11() {
  return (
    <div className="content-stretch flex flex-col h-[45px] items-start relative shrink-0 w-full" data-name="Container">
      <Heading7 />
      <Paragraph6 />
    </div>
  );
}

function ProductCard5() {
  return (
    <div className="absolute content-stretch flex flex-col h-[377.188px] items-start left-[297.75px] top-[482.19px] w-[265.75px]" data-name="ProductCard">
      <Container10 />
      <Container11 />
    </div>
  );
}

function ImageSienaAnkleBoot() {
  return (
    <div className="h-[332.188px] relative shrink-0 w-full" data-name="Image (Siena Ankle Boot)">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImageSienaAnkleBoot} />
    </div>
  );
}

function Container12() {
  return (
    <div className="content-stretch flex flex-col h-[332.188px] items-start overflow-clip relative shrink-0 w-full" data-name="Container">
      <ImageSienaAnkleBoot />
    </div>
  );
}

function Heading8() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Heading 3">
      <p className="absolute font-['Tinos:Regular',sans-serif] leading-[21px] left-0 not-italic text-[15px] text-black text-nowrap top-[-1px] tracking-[0.15px] whitespace-pre">Siena Ankle Boot</p>
    </div>
  );
}

function Paragraph7() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Light',sans-serif] font-light leading-[24px] left-0 not-italic text-[#666666] text-[15px] top-0 tracking-[-0.2344px] w-[47px]">$1,580</p>
    </div>
  );
}

function Container13() {
  return (
    <div className="content-stretch flex flex-col h-[45px] items-start relative shrink-0 w-full" data-name="Container">
      <Heading8 />
      <Paragraph7 />
    </div>
  );
}

function ProductCard6() {
  return (
    <div className="absolute content-stretch flex flex-col h-[377.188px] items-start left-[595.5px] top-[482.19px] w-[265.75px]" data-name="ProductCard">
      <Container12 />
      <Container13 />
    </div>
  );
}

function ImageVeneziaPlatformSandal() {
  return (
    <div className="h-[332.188px] relative shrink-0 w-full" data-name="Image (Venezia Platform Sandal)">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImageVeneziaPlatformSandal} />
    </div>
  );
}

function Container14() {
  return (
    <div className="content-stretch flex flex-col h-[332.188px] items-start overflow-clip relative shrink-0 w-full" data-name="Container">
      <ImageVeneziaPlatformSandal />
    </div>
  );
}

function Heading9() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Heading 3">
      <p className="absolute font-['Tinos:Regular',sans-serif] leading-[21px] left-0 not-italic text-[15px] text-black text-nowrap top-[-1px] tracking-[0.15px] whitespace-pre">Venezia Platform Sandal</p>
    </div>
  );
}

function Paragraph8() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Light',sans-serif] font-light leading-[24px] left-0 not-italic text-[#666666] text-[15px] top-0 tracking-[-0.2344px] w-[46px]">$2,150</p>
    </div>
  );
}

function Container15() {
  return (
    <div className="content-stretch flex flex-col h-[45px] items-start relative shrink-0 w-full" data-name="Container">
      <Heading9 />
      <Paragraph8 />
    </div>
  );
}

function ProductCard7() {
  return (
    <div className="absolute content-stretch flex flex-col h-[377.188px] items-start left-[893.25px] top-[482.19px] w-[265.75px]" data-name="ProductCard">
      <Container14 />
      <Container15 />
    </div>
  );
}

function ImageMilanoOverTheKneeBoot() {
  return (
    <div className="h-[332.188px] relative shrink-0 w-full" data-name="Image (Milano Over-The-Knee Boot)">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImageMilanoOverTheKneeBoot} />
    </div>
  );
}

function Container16() {
  return (
    <div className="content-stretch flex flex-col h-[332.188px] items-start overflow-clip relative shrink-0 w-full" data-name="Container">
      <ImageMilanoOverTheKneeBoot />
    </div>
  );
}

function Heading10() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Heading 3">
      <p className="absolute font-['Tinos:Regular',sans-serif] leading-[21px] left-0 not-italic text-[15px] text-black text-nowrap top-[-1px] tracking-[0.15px] whitespace-pre">Milano Over-The-Knee Boot</p>
    </div>
  );
}

function Paragraph9() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Light',sans-serif] font-light leading-[24px] left-0 not-italic text-[#666666] text-[15px] top-0 tracking-[-0.2344px] w-[50px]">$2,480</p>
    </div>
  );
}

function Container17() {
  return (
    <div className="content-stretch flex flex-col h-[45px] items-start relative shrink-0 w-full" data-name="Container">
      <Heading10 />
      <Paragraph9 />
    </div>
  );
}

function ProductCard8() {
  return (
    <div className="absolute content-stretch flex flex-col h-[377.188px] items-start left-0 top-[939.38px] w-[265.75px]" data-name="ProductCard">
      <Container16 />
      <Container17 />
    </div>
  );
}

function Section() {
  return (
    <div className="bg-white h-[1316.563px] relative shrink-0 w-full" data-name="Section">
      <ProductCard />
      <ProductCard1 />
      <ProductCard2 />
      <ProductCard3 />
      <ProductCard4 />
      <ProductCard5 />
      <ProductCard6 />
      <ProductCard7 />
      <ProductCard8 />
    </div>
  );
}

function MainContent() {
  return (
    <div className="content-stretch flex flex-col h-[1397.758px] items-start relative shrink-0 w-full" data-name="Main Content">
      <Hero />
      <Section />
    </div>
  );
}

function Heading11() {
  return (
    <div className="h-[19.594px] relative shrink-0 w-full" data-name="Heading 3">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[19.6px] left-0 not-italic text-[14px] text-black text-nowrap top-[-1px] tracking-[0.14px] uppercase whitespace-pre">In-Store Appointment</p>
    </div>
  );
}

function Paragraph10() {
  return (
    <div className="h-[19.195px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Light',sans-serif] font-light leading-[19.2px] left-0 not-italic text-[#666666] text-[12px] text-nowrap top-[0.5px] tracking-[0.12px] whitespace-pre">Discover the possibilities of a tailor-made visit</p>
    </div>
  );
}

function Container18() {
  return (
    <div className="basis-0 grow h-[46.789px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[8px] items-start relative size-full">
        <Heading11 />
        <Paragraph10 />
      </div>
    </div>
  );
}

function Icon() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d="M7.5 15L12.5 10L7.5 5" id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
        </g>
      </svg>
    </div>
  );
}

function Button() {
  return (
    <div className="absolute content-stretch flex h-[65.984px] items-start justify-between left-0 top-0 w-[362.664px]" data-name="Button">
      <Container18 />
      <Icon />
    </div>
  );
}

function Heading12() {
  return (
    <div className="h-[19.594px] relative shrink-0 w-full" data-name="Heading 3">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[19.6px] left-0 not-italic text-[14px] text-black text-nowrap top-[-1px] tracking-[0.14px] uppercase whitespace-pre">TEALHOUSE Signature Packaging</p>
    </div>
  );
}

function Paragraph11() {
  return (
    <div className="h-[19.195px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Light',sans-serif] font-light leading-[19.2px] left-0 not-italic text-[#666666] text-[12px] text-nowrap top-[0.5px] tracking-[0.12px] whitespace-pre">{`An example and emblem of the House's savoir-faire`}</p>
    </div>
  );
}

function Container19() {
  return (
    <div className="basis-0 grow h-[46.789px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[8px] items-start relative size-full">
        <Heading12 />
        <Paragraph11 />
      </div>
    </div>
  );
}

function Icon1() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d="M7.5 15L12.5 10L7.5 5" id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
        </g>
      </svg>
    </div>
  );
}

function Button1() {
  return (
    <div className="absolute content-stretch flex h-[65.984px] items-start justify-between left-[394.66px] top-0 w-[362.664px]" data-name="Button">
      <Container19 />
      <Icon1 />
    </div>
  );
}

function Heading13() {
  return (
    <div className="h-[19.594px] relative shrink-0 w-full" data-name="Heading 3">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[19.6px] left-0 not-italic text-[14px] text-black text-nowrap top-[-1px] tracking-[0.14px] uppercase whitespace-pre">{`Free Delivery & Returns`}</p>
    </div>
  );
}

function Paragraph12() {
  return (
    <div className="h-[38.391px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Light',sans-serif] font-light leading-[19.2px] left-0 not-italic text-[#666666] text-[12px] top-[0.5px] tracking-[0.12px] w-[339px]">{`Complimentary standard shipping and returns & exchanges within 30 days`}</p>
    </div>
  );
}

function Container20() {
  return (
    <div className="basis-0 grow h-[65.984px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[8px] items-start relative size-full">
        <Heading13 />
        <Paragraph12 />
      </div>
    </div>
  );
}

function Icon2() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d="M7.5 15L12.5 10L7.5 5" id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
        </g>
      </svg>
    </div>
  );
}

function Button2() {
  return (
    <div className="absolute content-stretch flex h-[65.984px] items-start justify-between left-[789.33px] top-0 w-[362.664px]" data-name="Button">
      <Container20 />
      <Icon2 />
    </div>
  );
}

function Container21() {
  return (
    <div className="absolute h-[66px] left-[20px] top-[63.24px] w-[1119px]" data-name="Container">
      <Button />
      <Button1 />
      <Button2 />
    </div>
  );
}

function ImageTealhouse() {
  return (
    <div className="absolute h-[10px] left-[545px] top-[22.24px] w-[112px]" data-name="Image (TEALHOUSE)">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImageTealhouse} />
    </div>
  );
}

function Heading14() {
  return (
    <div className="absolute h-[25.195px] left-0 top-0 w-[1152px]" data-name="Heading 3">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[25.2px] left-0 not-italic text-[#333333] text-[18px] text-nowrap top-[-1px] tracking-[0.18px] uppercase whitespace-pre">Inspire me with all the latest</p>
    </div>
  );
}

function EmailInput() {
  return (
    <div className="basis-0 bg-white grow h-[41px] min-h-px min-w-px relative shrink-0" data-name="Email Input">
      <div className="bg-clip-padding border border-[transparent] border-solid content-stretch flex items-center overflow-clip relative -[inherit] size-full">
        <p className="font-['Inter:Light',sans-serif] font-light leading-[normal] not-italic relative shrink-0 text-[13px] text-[rgba(0,0,0,0.5)] text-nowrap tracking-[0.0538px] whitespace-pre">* E-mail</p>
      </div>
      <div aria-hidden="true" className="absolute border border-black border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Button3() {
  return (
    <div className="bg-[#2c2c2c] h-[40px] relative shrink-0 w-[152px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[13px] leading-[19.5px] left-1/2 not-italic text-[13px] text-center text-white top-[calc(50%-9px)] tracking-[0.1838px] translate-x-[-50%] uppercase w-[152px]">Submit</p>
      </div>
    </div>
  );
}

function Form() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[40px] items-start left-0 top-[37px] w-[448px]" data-name="Form">
      <EmailInput />
      <Button3 />
    </div>
  );
}

function Container22() {
  return (
    <div className="absolute h-[100px] left-[21px] top-[141.24px] w-[1130px]" data-name="Container">
      <Heading14 />
      <Form />
    </div>
  );
}

function Heading2() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Heading 4">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[14px] text-black text-nowrap top-0 tracking-[-0.0104px] whitespace-pre">TEALHOUSE</p>
    </div>
  );
}

function Link() {
  return (
    <div className="absolute content-stretch flex h-[15px] items-start left-0 top-[5.5px] w-[87.078px]" data-name="Link">
      <p className="font-['Inter:Light',sans-serif] font-light leading-[19.5px] not-italic relative shrink-0 text-[#666666] text-[13px] text-nowrap tracking-[-0.0762px] whitespace-pre">Italian Handmade</p>
    </div>
  );
}

function ListItem() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="List Item">
      <Link />
    </div>
  );
}

function List() {
  return (
    <div className="content-stretch flex flex-col h-[48px] items-start relative shrink-0 w-full" data-name="List">
      <ListItem />
    </div>
  );
}

function Container23() {
  return (
    <div className="[grid-area:1_/_1] content-stretch flex flex-col gap-[24px] items-start place-self-stretch relative shrink-0" data-name="Container">
      <Heading2 />
      <List />
    </div>
  );
}

function Heading15() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Heading 4">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[14px] text-black text-nowrap top-0 tracking-[-0.0104px] whitespace-pre">Client Services</p>
    </div>
  );
}

function Link1() {
  return (
    <div className="absolute content-stretch flex h-[15px] items-start left-0 top-[5.5px] w-[47.617px]" data-name="Link">
      <p className="font-['Inter:Light',sans-serif] font-light leading-[19.5px] not-italic relative shrink-0 text-[#666666] text-[13px] text-nowrap tracking-[-0.0762px] whitespace-pre">Contact</p>
    </div>
  );
}

function ListItem1() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="List Item">
      <Link1 />
    </div>
  );
}

function Link2() {
  return (
    <div className="absolute content-stretch flex h-[15px] items-start left-0 top-[5.5px] w-[110.977px]" data-name="Link">
      <p className="font-['Inter:Light',sans-serif] font-light leading-[19.5px] not-italic relative shrink-0 text-[#666666] text-[13px] text-nowrap tracking-[-0.0762px] whitespace-pre">{`Delivery & Returns`}</p>
    </div>
  );
}

function ListItem2() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="List Item">
      <Link2 />
    </div>
  );
}

function Link3() {
  return (
    <div className="absolute content-stretch flex h-[15px] items-start left-0 top-[5.5px] w-[24.734px]" data-name="Link">
      <p className="font-['Inter:Light',sans-serif] font-light leading-[19.5px] not-italic relative shrink-0 text-[#666666] text-[13px] text-nowrap tracking-[-0.0762px] whitespace-pre">FAQ</p>
    </div>
  );
}

function ListItem3() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="List Item">
      <Link3 />
    </div>
  );
}

function List1() {
  return (
    <div className="content-stretch flex flex-col h-[72px] items-start relative shrink-0 w-full" data-name="List">
      <ListItem1 />
      <ListItem2 />
      <ListItem3 />
    </div>
  );
}

function Container24() {
  return (
    <div className="[grid-area:1_/_2] content-stretch flex flex-col gap-[24px] items-start place-self-stretch relative shrink-0" data-name="Container">
      <Heading15 />
      <List1 />
    </div>
  );
}

function Heading16() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Heading 4">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[14px] text-black text-nowrap top-0 tracking-[-0.0104px] whitespace-pre">TEALHOUSE</p>
    </div>
  );
}

function Link4() {
  return (
    <div className="absolute content-stretch flex h-[15px] items-start left-0 top-[5.5px] w-[131.469px]" data-name="Link">
      <p className="font-['Inter:Light',sans-serif] font-light leading-[19.5px] not-italic relative shrink-0 text-[#666666] text-[13px] text-nowrap tracking-[-0.0762px] whitespace-pre">Plant-Based Materials</p>
    </div>
  );
}

function ListItem4() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="List Item">
      <Link4 />
    </div>
  );
}

function Link5() {
  return (
    <div className="absolute content-stretch flex h-[15px] items-start left-0 top-[5.5px] w-[123.641px]" data-name="Link">
      <p className="font-['Inter:Light',sans-serif] font-light leading-[19.5px] not-italic relative shrink-0 text-[#666666] text-[13px] text-nowrap tracking-[-0.0762px] whitespace-pre">{`Ethics & Compliance`}</p>
    </div>
  );
}

function ListItem5() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="List Item">
      <Link5 />
    </div>
  );
}

function Link6() {
  return (
    <div className="absolute content-stretch flex h-[15px] items-start left-0 top-[5.5px] w-[79.625px]" data-name="Link">
      <p className="font-['Inter:Light',sans-serif] font-light leading-[19.5px] not-italic relative shrink-0 text-[#666666] text-[13px] text-nowrap tracking-[-0.0762px] whitespace-pre">Sustainability</p>
    </div>
  );
}

function ListItem6() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="List Item">
      <Link6 />
    </div>
  );
}

function List2() {
  return (
    <div className="content-stretch flex flex-col h-[120px] items-start relative shrink-0 w-full" data-name="List">
      <ListItem4 />
      <ListItem5 />
      <ListItem6 />
    </div>
  );
}

function Container25() {
  return (
    <div className="[grid-area:1_/_3] content-stretch flex flex-col gap-[24px] items-start place-self-stretch relative shrink-0" data-name="Container">
      <Heading16 />
      <List2 />
    </div>
  );
}

function Heading17() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Heading 4">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[14px] text-black text-nowrap top-0 tracking-[-0.0104px] whitespace-pre">Legal Notices</p>
    </div>
  );
}

function Link7() {
  return (
    <div className="absolute content-stretch flex h-[15px] items-start left-0 top-[5.5px] w-[82.391px]" data-name="Link">
      <p className="font-['Inter:Light',sans-serif] font-light leading-[19.5px] not-italic relative shrink-0 text-[#666666] text-[13px] text-nowrap tracking-[-0.0762px] whitespace-pre">Privacy Policy</p>
    </div>
  );
}

function ListItem7() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="List Item">
      <Link7 />
    </div>
  );
}

function Link8() {
  return (
    <div className="absolute content-stretch flex h-[15px] items-start left-0 top-[5.5px] w-[48.984px]" data-name="Link">
      <p className="font-['Inter:Light',sans-serif] font-light leading-[19.5px] not-italic relative shrink-0 text-[#666666] text-[13px] text-nowrap tracking-[-0.0762px] whitespace-pre">Sitemap</p>
    </div>
  );
}

function ListItem8() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="List Item">
      <Link8 />
    </div>
  );
}

function List3() {
  return (
    <div className="content-stretch flex flex-col h-[144px] items-start relative shrink-0 w-full" data-name="List">
      <ListItem7 />
      <ListItem8 />
    </div>
  );
}

function Container26() {
  return (
    <div className="[grid-area:1_/_4] content-stretch flex flex-col gap-[24px] items-start place-self-stretch relative shrink-0" data-name="Container">
      <Heading17 />
      <List3 />
    </div>
  );
}

function Container27() {
  return (
    <div className="absolute gap-[48px] grid grid-cols-[repeat(4,_minmax(0px,_1fr))] grid-rows-[repeat(1,_minmax(0px,_1fr))] h-[131px] left-[20px] top-[252.24px] w-[1122px]" data-name="Container">
      <Container23 />
      <Container24 />
      <Container25 />
      <Container26 />
    </div>
  );
}

function Icon3() {
  return (
    <div className="absolute left-[237.67px] size-[16px] top-px" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M6 12L10 8L6 4" id="Vector" stroke="var(--stroke-0, #666666)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Button4() {
  return (
    <div className="absolute h-[18px] left-[898px] top-[409.24px] w-[253.672px]" data-name="Button">
      <p className="absolute font-['Inter:Light',sans-serif] font-light leading-[18px] left-[115.5px] not-italic text-[#666666] text-[12px] text-center text-nowrap top-px tracking-[0.12px] translate-x-[-50%] whitespace-pre">Country / Region United States (English)</p>
      <Icon3 />
    </div>
  );
}

function Footer() {
  return (
    <div className="[grid-area:1_/_1] bg-white h-[359.875px] ml-0 mt-0 relative w-[1159px]" data-name="Footer">
      <Container21 />
      <ImageTealhouse />
      <Container22 />
      <Container27 />
      <Button4 />
    </div>
  );
}

function Group2() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0 w-full">
      <Footer />
    </div>
  );
}

function App() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col h-[1837px] items-start left-0 top-0 w-[1159px]" data-name="App">
      <MainContent />
      <Group2 />
    </div>
  );
}

function Text() {
  return (
    <div className="absolute content-stretch flex h-[15px] items-center justify-end left-0 top-[2px] w-[1137px]" data-name="Text">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[19.5px] not-italic relative shrink-0 text-[13px] text-black text-center text-nowrap tracking-[0.9638px] uppercase whitespace-pre">Filter</p>
    </div>
  );
}

function Button5() {
  return (
    <div className="h-[20px] relative shrink-0 w-[1150px]" data-name="Button">
      <Text />
    </div>
  );
}

function Container28() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="size-full" />
      </div>
    </div>
  );
}

function ProductFilters() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col h-[25px] items-start left-0 pb-px pt-0 px-0 top-[217px] w-[1159px]" data-name="ProductFilters">
      <div aria-hidden="true" className="absolute border-[#ebebeb] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <Button5 />
      <Container28 />
    </div>
  );
}

function LuxuryEcommerceWebsite() {
  return (
    <div className="absolute bg-white h-[1837px] left-0 top-[81px] w-[1159px]" data-name="Luxury Ecommerce Website">
      <App />
      <ProductFilters />
    </div>
  );
}

function Header() {
  return <div className="absolute bg-white border-[#ebebeb] border-[0px_0px_1px] border-solid h-[81px] left-0 top-0 w-[1159px]" data-name="Header" />;
}

function Container29() {
  return <div className="absolute h-[80px] left-0 top-0 w-[1159px]" data-name="Container" />;
}

function Icon4() {
  return (
    <div className="h-[20px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[20.83%_16.67%_79.17%_16.67%]" data-name="Vector">
        <div className="absolute inset-[-0.63px_-4.69%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 2">
            <path d="M0.625 0.625H13.9583" id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-1/2 left-[16.67%] right-[16.67%] top-1/2" data-name="Vector">
        <div className="absolute inset-[-0.63px_-4.69%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 2">
            <path d="M0.625 0.625H13.9583" id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[79.17%_16.67%_20.83%_16.67%]" data-name="Vector">
        <div className="absolute inset-[-0.63px_-4.69%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 2">
            <path d="M0.625 0.625H13.9583" id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Button6() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[17px] size-[20px] top-[30px]" data-name="Button">
      <Icon4 />
    </div>
  );
}

function Icon5() {
  return (
    <div className="h-[20px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[69.42%_12.5%_12.5%_69.42%]" data-name="Vector">
        <div className="absolute inset-[-17.28%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5 5">
            <path d="M4.24167 4.24167L0.625 0.625" id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[12.5%_20.83%_20.83%_12.5%]" data-name="Vector">
        <div className="absolute inset-[-4.69%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
            <path d={svgPaths.p95dc940} id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Button7() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Icon5 />
      </div>
    </div>
  );
}

function Icon6() {
  return (
    <div className="h-[20px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[16.6%_8.33%_12.5%_8.33%]" data-name="Vector">
        <div className="absolute inset-[-4.41%_-3.75%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 16">
            <path d={svgPaths.p2adf6a00} id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Button8() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Icon6 />
      </div>
    </div>
  );
}

function Icon7() {
  return (
    <div className="h-[20px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[41.67%_33.33%]" data-name="Vector">
        <div className="absolute inset-[-18.75%_-9.38%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 5">
            <path d={svgPaths.p33f48a00} id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[25.14%_12.93%_74.86%_12.93%]" data-name="Vector">
        <div className="absolute inset-[-0.63px_-4.21%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17 2">
            <path d="M0.625 0.625H15.4533" id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[8.33%_12.5%]" data-name="Vector">
        <div className="absolute inset-[-3.75%_-4.17%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17 18">
            <path d={svgPaths.p18ae9c80} id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Button9() {
  return (
    <div className="basis-0 grow h-[20px] min-h-px min-w-px relative shrink-0" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Icon7 />
      </div>
    </div>
  );
}

function Container30() {
  return (
    <div className="absolute content-stretch flex gap-[20px] h-[20px] items-center left-[1043px] top-[30px] w-[100px]" data-name="Container">
      <Button7 />
      <Button8 />
      <Button9 />
    </div>
  );
}

function ImageTealhouse1() {
  return (
    <div className="absolute h-[20px] left-0 top-0 w-[222.734px]" data-name="Image (TEALHOUSE)">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImageTealhouse} />
    </div>
  );
}

function Link9() {
  return (
    <div className="absolute h-[20px] left-[468.13px] top-[30px] w-[222.734px]" data-name="Link">
      <ImageTealhouse1 />
    </div>
  );
}

function Group() {
  return (
    <div className="absolute contents left-[17px] top-[30px]">
      <Button6 />
      <Container30 />
      <Link9 />
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute contents left-0 top-0">
      <Container29 />
      <Group />
    </div>
  );
}

export default function Frame() {
  return (
    <div className="relative size-full">
      <LuxuryEcommerceWebsite />
      <Header />
      <Group1 />
    </div>
  );
}