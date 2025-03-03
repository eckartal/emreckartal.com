export function Figure({ wide = false, children }) {
  return (
    <div
      className={`
    text-center
    -mx-14 sm:-mx-20 md:-mx-28
    ${
      wide
        ? `
      -mx-18 sm:-mx-28 md:-mx-36
      bg-gray-100
      dark:bg-[#111]
      relative
      before:bg-gray-100
      before:dark:bg-[#111]
      before:w-[10000%]
      before:h-[100%]
      before:content-[""]
      before:top-[0]
      before:left-[-1000px]
      before:absolute
      before:z-[-1]
    `
        : ""
    }
    [&_img]:rounded-[17px]
  `}
    >
      {children}
    </div>
  );
}
