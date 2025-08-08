// Tremor LineChart [v1.0.0]

import React from "react"
import {
  Line,
  LineChart as RechartsLineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend as RechartsLegend,
  Dot,
} from "recharts"
import { RiArrowLeftSLine, RiArrowRightSLine } from "@remixicon/react"

import {
  AvailableChartColors,
  constructCategoryColors,
  getColorClassName,
  getYAxisDomain,
  hasOnlyOneValueForKey,
} from "../../lib/chartUtils"
import { cx } from "../../lib/utils"
import { useOnWindowResize } from "../../hooks/useOnWindowResize"

const LegendItem = ({ name, color, onClick, activeLegend }) => {
  const hasOnValueChange = !!onClick
  return (
    <li
      className={cx(
        // base
        "group inline-flex flex-nowrap items-center gap-1.5 whitespace-nowrap rounded px-2 py-1 transition",
        hasOnValueChange
          ? "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900"
          : "cursor-default",
      )}
      onClick={(e) => {
        e.stopPropagation()
        onClick?.(name, color)
      }}
    >
      <span
        className={cx(
          "h-[3px] w-3.5 shrink-0 rounded-full",
          getColorClassName(color, "bg"),
          activeLegend && activeLegend !== name ? "opacity-40" : "opacity-100",
        )}
        aria-hidden={true}
      />
      <p
        className={cx(
          // base
          "truncate whitespace-nowrap text-xs",
          // text color
          "text-gray-700 dark:text-gray-300",
          hasOnValueChange &&
            "group-hover:text-gray-900 dark:group-hover:text-gray-50",
          activeLegend && activeLegend !== name ? "opacity-40" : "opacity-100",
        )}
      >
        {name}
      </p>
    </li>
  )
}

const ScrollButton = ({ icon, onClick, disabled }) => {
  const Icon = icon
  const [isPressed, setIsPressed] = React.useState(false)
  const intervalRef = React.useRef(null)

  React.useEffect(() => {
    if (isPressed) {
      intervalRef.current = setInterval(() => {
        onClick()
      }, 300)
    } else {
      clearInterval(intervalRef.current)
    }
    return () => clearInterval(intervalRef.current)
  }, [isPressed, onClick])

  React.useEffect(() => {
    const handleMouseUp = () => setIsPressed(false)
    document.addEventListener("mouseup", handleMouseUp)
    return () => document.removeEventListener("mouseup", handleMouseUp)
  }, [])

  return (
    <button
      type="button"
      className={cx(
        // base
        "group inline-flex size-5 items-center truncate rounded transition",
        disabled
          ? "cursor-not-allowed text-gray-400 dark:text-gray-600"
          : "cursor-pointer text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-900 dark:hover:text-gray-50",
      )}
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      onMouseDown={(e) => {
        e.stopPropagation()
        setIsPressed(true)
      }}
    >
      <Icon className="size-full" aria-hidden="true" />
    </button>
  )
}

const Legend = React.forwardRef((props, ref) => {
  const {
    categories,
    colors,
    onClickLegendItem,
    activeLegend,
    enableLegendSlider,
  } = props
  const scrollableRef = React.useRef(null)
  const scrollButtonsRef = React.useRef(null)
  const [hasScroll, setHasScroll] = React.useState(null)
  const [isKeyDowned, setIsKeyDowned] = React.useState(null)
  const [isScrolled, setIsScrolled] = React.useState({ left: null, right: null })

  const checkScroll = React.useCallback(() => {
    const scrollable = scrollableRef?.current
    if (!scrollable) return

    const hasLeftScroll = scrollable.scrollLeft > 0
    const hasRightScroll =
      scrollable.scrollWidth - scrollable.clientWidth > scrollable.scrollLeft

    setIsScrolled({ left: hasLeftScroll, right: hasRightScroll })
  }, [])

  const scrollToTest = React.useCallback(
    (direction) => {
      const element = scrollableRef?.current
      const scrollButtons = scrollButtonsRef?.current
      const scrollButtonsWith = scrollButtons?.clientWidth ?? 0
      const width = element?.clientWidth ?? 0

      if (element && enableLegendSlider) {
        element.scrollTo({
          left:
            direction === "left"
              ? element.scrollLeft - width + scrollButtonsWith
              : element.scrollLeft + width - scrollButtonsWith,
          behavior: "smooth",
        })
        setTimeout(() => {
          checkScroll()
        }, 400)
      }
    },
    [enableLegendSlider, checkScroll],
  )

  React.useEffect(() => {
    const scrollable = scrollableRef?.current
    if (enableLegendSlider) {
      checkScroll()
      scrollable?.addEventListener("scroll", checkScroll)
    }
    return () => {
      scrollable?.removeEventListener("scroll", checkScroll)
    }
  }, [checkScroll, enableLegendSlider])

  const keyMap = React.useMemo(
    () => ({
      ArrowLeft: () => scrollToTest("left"),
      ArrowRight: () => scrollToTest("right"),
    }),
    [scrollToTest],
  )

  const handleKeyDown = (event) => {
    const handler = keyMap[event.key]
    if (handler) {
      event.preventDefault()
      setIsKeyDowned(event.key)
      handler()
    }
  }

  const handleKeyUp = (event) => {
    setIsKeyDowned(null)
  }

  React.useEffect(() => {
    const element = scrollableRef?.current
    if (element && enableLegendSlider) {
      setHasScroll(
        element.scrollWidth > element.clientWidth || element.scrollWidth > 0,
      )
    }
  }, [enableLegendSlider])

  return (
    <div
      ref={ref}
      className={cx("flex items-center", hasScroll ? "justify-between" : "justify-center")}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
    >
      {hasScroll && (
        <ScrollButton
          icon={RiArrowLeftSLine}
          onClick={() => {
            setIsKeyDowned("ArrowLeft")
            scrollToTest("left")
          }}
          disabled={!enableLegendSlider || !isScrolled.left}
        />
      )}
      <div
        ref={scrollableRef}
        tabIndex={0}
        className={cx(
          "flex h-full",
          hasScroll
            ? "snap-x snap-mandatory overflow-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            : "",
        )}
      >
        <div
          className={cx(
            "flex h-full flex-wrap items-center",
            hasScroll ? "flex-nowrap" : "flex-wrap",
          )}
        >
          {categories.map((category, index) => (
            <LegendItem
              key={`item-${index}`}
              name={category}
              color={colors.get(category)}
              onClick={onClickLegendItem}
              activeLegend={activeLegend}
            />
          ))}
        </div>
      </div>
      {hasScroll && (
        <ScrollButton
          icon={RiArrowRightSLine}
          onClick={() => {
            setIsKeyDowned("ArrowRight")
            scrollToTest("right")
          }}
          disabled={!enableLegendSlider || !isScrolled.right}
        />
      )}
    </div>
  )
})

Legend.displayName = "Legend"

const ChartLegend = (props, ref) => {
  const { payload } = props
  if (!payload?.length) return null

  const categories = payload.map((entry) => entry.value)
  const colors = new Map()
  payload.forEach((entry) => {
    colors.set(entry.value, entry.color)
  })

  return (
    <div className="flex items-center justify-center overflow-hidden">
      <Legend
        ref={ref}
        categories={categories}
        colors={colors}
        onClickLegendItem={props.onClickLegendItem}
        activeLegend={props.activeLegend}
        enableLegendSlider={props.enableLegendSlider}
      />
    </div>
  )
}

ChartLegend.displayName = "ChartLegend"

const ChartTooltip = ({ active, payload, label, categoryColors, valueFormatter }) => {
  if (active && payload && payload.length) {
    return (
      <div
        className={cx(
          // base
          "rounded-md border text-sm shadow-md",
          // border color
          "border-gray-200 dark:border-gray-800",
          // background color
          "bg-white dark:bg-gray-950",
        )}
      >
        <div className={cx("border-b border-inherit px-4 py-2")}>
          <p
            className={cx(
              "font-medium",
              "text-gray-900 dark:text-gray-50",
            )}
          >
            {label}
          </p>
        </div>

        <div className={cx("space-y-1 px-4 py-2")}>
          {payload
            .sort((a, b) => b.value - a.value)
            .map(({ value, name }, index) => (
              <div
                key={`id-${index}`}
                className="flex items-center space-x-2.5"
              >
                <div
                  className={cx(
                    "h-2.5 w-2.5 shrink-0 rounded-sm",
                    getColorClassName(
                      categoryColors.get(name),
                      "bg",
                    ),
                  )}
                />
                <div className="flex w-full justify-between">
                  <p
                    className={cx(
                      "whitespace-nowrap text-right",
                      "text-gray-700 dark:text-gray-300",
                    )}
                  >
                    {name}
                  </p>
                  <p
                    className={cx(
                      "whitespace-nowrap text-right font-medium tabular-nums",
                      "text-gray-900 dark:text-gray-50",
                    )}
                  >
                    {valueFormatter(value)}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>
    )
  }
  return null
}

const LineChart = React.forwardRef((props, ref) => {
  const {
    data = [],
    categories = [],
    index,
    colors = AvailableChartColors,
    valueFormatter = (value) => value.toString(),
    startEndOnly = false,
    showXAxis = true,
    showYAxis = true,
    showGridLines = true,
    yAxisWidth = 56,
    intervalType = "equidistantPreserveStart",
    showTooltip = true,
    showLegend = true,
    autoMinValue = false,
    minValue,
    maxValue,
    allowDecimals = true,
    connectNulls = false,
    noDataText,
    onValueChange,
    enableLegendSlider = false,
    customTooltip,
    rotateLabelX,
    tickGap = 5,
    xAxisLabel,
    yAxisLabel,
    className,
    ...other
  } = props

  const CustomTooltip = customTooltip
  const paddingValue = (!showXAxis && !showYAxis) || (startEndOnly && !showYAxis) ? 0 : 20
  const [legendHeight, setLegendHeight] = React.useState(60)
  const [activeDot, setActiveDot] = React.useState(undefined)
  const [activeLegend, setActiveLegend] = React.useState(undefined)
  const categoryColors = constructCategoryColors(categories, colors)

  const yAxisDomain = getYAxisDomain(autoMinValue, minValue, maxValue)
  const hasOnValueChange = !!onValueChange

  function onDotClick(props, event) {
    event.stopPropagation()

    if (!hasOnValueChange) return
    if (activeDot?.index === props.index && activeDot?.dataKey === props.dataKey) {
      setActiveDot(undefined)
      onValueChange?.(null, event)
    } else {
      setActiveDot({
        index: props.index,
        dataKey: props.dataKey,
      })
      onValueChange?.(
        {
          eventType: "dot",
          categoryClicked: props.dataKey,
          ...props.payload,
        },
        event,
      )
    }
  }

  function onCategoryClick(dataKey) {
    if (!hasOnValueChange) return
    if (activeLegend === dataKey) {
      setActiveLegend(undefined)
      onValueChange?.(null)
    } else {
      setActiveLegend(dataKey)
      onValueChange?.({
        eventType: "category",
        categoryClicked: dataKey,
      })
    }
    setActiveDot(undefined)
  }

  const legendRef = React.useRef(null)

  useOnWindowResize(() => {
    const calculateHeight = (height) => height + paddingValue + 20
    const height = legendRef.current?.clientHeight ?? 60
    setLegendHeight(calculateHeight(height))
  })

  const filteredData = data.filter((item) => item[index] !== undefined)

  return (
    <div ref={ref} className={cx("h-80 w-full", className)} tremor-id="tremor-raw" {...other}>
      {data?.length ? (
        <ResponsiveContainer className="h-full w-full">
          <RechartsLineChart
            data={filteredData}
            onClick={
              hasOnValueChange && (activeLegend || activeDot)
                ? () => {
                    setActiveLegend(undefined)
                    setActiveDot(undefined)
                    onValueChange?.(null)
                  }
                : undefined
            }
            margin={{
              bottom: showLegend ? legendHeight : undefined,
              left: paddingValue,
              right: paddingValue,
              top: paddingValue,
            }}
          >
            {showGridLines ? (
              <>
                <XAxis
                  padding={{ left: paddingValue, right: paddingValue }}
                  hide={!showXAxis}
                  dataKey={index}
                  interval={startEndOnly ? "preserveStartEnd" : intervalType}
                  tick={{ transform: "translate(0, 6)" }}
                  ticks={
                    startEndOnly
                      ? [filteredData[0]?.[index], filteredData[filteredData.length - 1]?.[index]]
                      : undefined
                  }
                  fill=""
                  stroke=""
                  className={cx(
                    // base
                    "text-xs",
                    // text fill
                    "fill-gray-500 dark:fill-gray-500",
                  )}
                  tickLine={false}
                  axisLine={false}
                  minTickGap={tickGap}
                  angle={rotateLabelX?.angle ?? 0}
                  textAnchor={rotateLabelX?.textAnchor ?? "middle"}
                  height={rotateLabelX?.height ?? undefined}
                />
                <YAxis
                  width={yAxisWidth}
                  hide={!showYAxis}
                  axisLine={false}
                  tickLine={false}
                  type="number"
                  domain={yAxisDomain}
                  tick={{ transform: "translate(-3, 0)" }}
                  fill=""
                  stroke=""
                  className={cx(
                    // base
                    "text-xs",
                    // text fill
                    "fill-gray-500 dark:fill-gray-500",
                  )}
                  tickFormatter={valueFormatter}
                  allowDecimals={allowDecimals}
                />
              </>
            ) : (
              <>
                <XAxis dataKey={index} hide />
                <YAxis domain={yAxisDomain} hide />
              </>
            )}
            <Tooltip
              wrapperStyle={{ outline: "none" }}
              isAnimationActive={true}
              animationDuration={100}
              cursor={{ stroke: "#d1d5db", strokeWidth: 1 }}
              offset={20}
              position={{ y: 0 }}
              content={
                showTooltip ? (
                  ({ active, payload, label }) =>
                    CustomTooltip ? (
                      <CustomTooltip
                        payload={payload}
                        active={active}
                        label={label}
                      />
                    ) : (
                      <ChartTooltip
                        active={active}
                        payload={payload}
                        label={label}
                        valueFormatter={valueFormatter}
                        categoryColors={categoryColors}
                      />
                    )
                ) : (
                  <></>  
                )
              }
            />
            {showLegend ? (
              <RechartsLegend
                verticalAlign="bottom"
                height={legendHeight}
                content={({ payload }) =>
                  ChartLegend(
                    {
                      payload,
                      onClickLegendItem: onCategoryClick,
                      activeLegend,
                      enableLegendSlider,
                    },
                    legendRef,
                  )
                }
              />
            ) : null}
            {categories.map((category) => (
              <Line
                className={cx(
                  getColorClassName(categoryColors.get(category), "stroke"),
                  onValueChange ? "cursor-pointer" : "",
                )}
                strokeOpacity={
                  activeLegend && activeLegend !== category ? 0.3 : 1
                }
                activeDot={(props) => {
                  const {
                    cx: cxCoord,
                    cy: cyCoord,
                    stroke,
                    strokeLinecap,
                    strokeLinejoin,
                    strokeWidth,
                    dataKey,
                  } = props
                  return (
                    <Dot
                      className={cx(
                        "stroke-white dark:stroke-gray-950",
                        onValueChange ? "cursor-pointer" : "",
                        getColorClassName(
                          categoryColors.get(dataKey),
                          "fill",
                        ),
                      )}
                      cx={cxCoord}
                      cy={cyCoord}
                      r={5}
                      fill=""
                      stroke={stroke}
                      strokeLinecap={strokeLinecap}
                      strokeLinejoin={strokeLinejoin}
                      strokeWidth={strokeWidth}
                      onClick={(_, event) => onDotClick(props, event)}
                    />
                  )
                }}
                dot={(props) => {
                  const {
                    stroke,
                    strokeLinecap,
                    strokeLinejoin,
                    strokeWidth,
                    cx: cxCoord,
                    cy: cyCoord,
                    dataKey,
                    index,
                  } = props

                  if (
                    (hasOnlyOneValueForKey(data, category) &&
                      !(
                        activeDot ||
                        (activeLegend && activeLegend !== category)
                      )) ||
                    (activeDot?.index === index &&
                      activeDot?.dataKey === category)
                  ) {
                    return (
                      <Dot
                        key={index}
                        cx={cxCoord}
                        cy={cyCoord}
                        r={5}
                        stroke={stroke}
                        fill=""
                        strokeLinecap={strokeLinecap}
                        strokeLinejoin={strokeLinejoin}
                        strokeWidth={strokeWidth}
                        className={cx(
                          "stroke-white dark:stroke-gray-950",
                          onValueChange ? "cursor-pointer" : "",
                          getColorClassName(
                            categoryColors.get(dataKey),
                            "fill",
                          ),
                        )}
                      />
                    )
                  }
                  return <React.Fragment key={index}></React.Fragment>
                }}
                key={category}
                name={category}
                type="linear"
                dataKey={category}
                stroke=""
                strokeWidth={2}
                strokeLinejoin="round"
                strokeLinecap="round"
                isAnimationActive={false}
                connectNulls={connectNulls}
              />
            ))}
            {/* hidden lines to increase clickable target area */}
            {onValueChange
              ? categories.map((category) => (
                  <Line
                    className={cx("cursor-pointer")}
                    strokeOpacity={0}
                    key={category}
                    name={category}
                    type="linear"
                    dataKey={category}
                    stroke="transparent"
                    fill="transparent"
                    legendType="none"
                    tooltipType="none"
                    strokeWidth={12}
                    connectNulls={connectNulls}
                    onClick={(props, event) => {
                      event.stopPropagation()
                      const { name } = props
                      onCategoryClick(name)
                    }}
                  />
                ))
              : null}
          </RechartsLineChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400">
            {noDataText ?? "No data available"}
          </p>
        </div>
      )}
    </div>
  )
})

LineChart.displayName = "LineChart"

export { LineChart }