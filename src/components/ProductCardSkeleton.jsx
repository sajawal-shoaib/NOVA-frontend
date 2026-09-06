import Skeleton from "./Skeleton"

export default function ProductCardSkeleton({ fluid = false }) {
  return (
    <div
      className={
        fluid
          ? "relative h-full w-full pb-4 pr-4"
          : "relative h-full w-[80vw] shrink-0 pb-4 pr-4 sm:w-[55vw] lg:w-[26rem]"
      }
    >
      <div
        className={`flex h-full flex-col items-center rounded-[32px] border border-nova-border bg-white px-8 text-center ${
          fluid ? "min-h-[540px] pb-10 pt-7 lg:min-h-[600px]" : "min-h-[460px] pb-8 pt-6"
        }`}
      >
        <div className="flex w-full items-center justify-start">
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
        <div className="flex flex-1 items-center justify-center px-2 py-6">
          <Skeleton className={`w-full ${fluid ? "h-[19rem] lg:h-[22rem]" : "h-72"}`} />
        </div>
        <div className="mt-2 w-full space-y-2">
          <Skeleton className="mx-auto h-6 w-3/5" />
          <Skeleton className="mx-auto h-4 w-4/5" />
          <Skeleton className="mx-auto h-4 w-1/3" />
        </div>
      </div>
    </div>
  )
}
