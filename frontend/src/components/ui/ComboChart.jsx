"use client"

import React from "react"
import { RiArrowLeftSLine, RiArrowRightSLine } from "@remixicon/react"
import {
  Bar,
  CartesianGrid,
  ComposedChart as RechartsComposedChart,
  Dot,
  Label,
  Line,
  Legend as RechartsLegend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import {
  AvailableChartColors,
  constructCategoryColors,
  getColorClassName,
  getYAxisDomain,
  hasOnlyOneValueForKey,
  deepEqual,
} from "../../lib/chartUtils"
import { useOnWindowResize } from "../../lib/useOnWindowResize"
import { cx } from "../../lib/utils"

//#region Shape

const renderShape = (
  props,
  activeBar,
  activeLegend,
) => {
  const { fillOpacity, name, payload, value } = props
  let { x, width, y, height } = props

  if (height < 0) {
    y += height
    height = Math.abs(height) // height must be a positive number
  }

  return (
    <rect
      x={x}
      y={y}
      width={width}
      height={height}
      opacity={
        activeBar || (activeLegend && activeLegend !== name)
          ? deepEqual(activeBar, { ...payload, value })
            ? fillOpacity
            : 0.3
          : fillOpacity
      }
    />
  )
}

//#region Legend

const LegendItem = ({
  name,
  chartType,
  color,
  onClick,
  activeLegend,
}) => {
  const hasOnValueChange = !!onClick
  return (
    <li
      className={cx(
        // base
        "group inline-flex flex-nowrap items-center gap-1.5 rounded-sm px-2 py-1 whitespace-nowrap transition",
        hasOnValueChange
          ? "cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
          : "cursor-default",
      )}
      onClick={(e) => {
        e.stopPropagation()
        onClick?.(name, color)
      }}
    >
      <div className="flex w-5 items-center justify-center">
        <span
          className={cx(
            { "size-2 rounded-xs": chartType === "bar" },
            {
              "h-[3px] w-3.5 shrink-0 rounded-full":
                chartType === "line",
            },
            "shrink-0",
            getColorClassName(color, "bg"),
            activeLegend && activeLegend !== name ? "opacity-40" : "opacity-100",
          )}
          aria-hidden={true}
        />
      </div>
      <p
        className={cx(
          // base
          "truncate text-xs whitespace-nowrap",
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
        onClick?.()
      }, 300)
    } else {
      clearInterval(intervalRef.current)
    }
    return () => clearInterval(intervalRef.current)
  }, [isPressed, onClick])

  React.useEffect(() => {
    if (disabled) {
      clearInterval(intervalRef.current)
      setIsPressed(false)
    }
  }, [disabled])

  return (
    <button
      type="button"
      className={cx(
        // base
        "group inline-flex size-5 items-center truncate rounded-sm transition",
        disabled
          ? "cursor-not-allowed text-gray-400 dark:text-gray-600"
          : "cursor-pointer text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50",
      )}
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation()
        onClick?.()
      }}
      onMouseDown={(e) => {
        e.stopPropagation()
        setIsPressed(true)
      }}
      onMouseUp={(e) => {
        e.stopPropagation()
        setIsPressed(false)
      }}
    >
      <Icon className="size-full" aria-hidden="true" />
    </button>
  )
}

const Legend = React.forwardRef((props, ref) => {
  const {
    categories,
    barCategoryColors,
    lineCategoryColors,
    onClickLegendItem,
    activeLegend,
    enableLegendSlider = false,
    className,
    ...other
  } = props
  const scrollableRef = React.useRef(null)
  const [hasScroll, setHasScroll] = React.useState(null)
  const [isKeyDowned, setIsKeyDowned] = React.useState(null)
  const intervalRef = React.useRef(null)

  const checkScroll = React.useCallback(() => {
    const scrollable = scrollableRef?.current
    if (!scrollable) return

    const hasLeftScroll = scrollable.scrollLeft > 0
    const hasRightScroll =
      scrollable.scrollWidth - scrollable.clientWidth > scrollable.scrollLeft

    setHasScroll({ left: hasLeftScroll, right: hasRightScroll })
  }, [setHasScroll])

  const scrollToTest = React.useCallback(
    (direction) => {
      const element = scrollableRef?.current
      const width = element?.clientWidth ?? 0

      if (element && enableLegendSlider) {
        element.scrollTo({
          left:
            direction === "left"
              ? element.scrollLeft - width
              : element.scrollLeft + width,
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
    const keyDownHandler = (key) => {
      if (key === "ArrowLeft") {
        scrollToTest("left")
      } else if (key === "ArrowRight") {
        scrollToTest("right")
      }
    }
    if (isKeyDowned) {
      keyDownHandler(isKeyDowned)
      intervalRef.current = setInterval(() => {
        keyDownHandler(isKeyDowned)
      }, 300)
    } else {
      clearInterval(intervalRef.current)
    }
    return () => clearInterval(intervalRef.current)
  }, [isKeyDowned, scrollToTest])

  const keyDown = (e) => {
    e.stopPropagation()
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      e.preventDefault()
      setIsKeyDowned(e.key)
    }
  }
  const keyUp = (e) => {
    e.stopPropagation()
    setIsKeyDowned(null)
  }

  React.useEffect(() => {
    const scrollable = scrollableRef?.current
    if (enableLegendSlider) {
      checkScroll()
      scrollable?.addEventListener("keydown", keyDown)
      scrollable?.addEventListener("keyup", keyUp)
    }

    return () => {
      scrollable?.removeEventListener("keydown", keyDown)
      scrollable?.removeEventListener("keyup", keyUp)
    }
  }, [checkScroll, enableLegendSlider])

  return (
    <ol
      ref={ref}
      className={cx("relative overflow-hidden", className)}
      {...other}
    >
      <div
        ref={scrollableRef}
        className={cx(
          "flex h-full",
          enableLegendSlider
            ? hasScroll?.right || hasScroll?.left
              ? "snap-mandatory items-center overflow-auto pr-12 pl-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              : ""
            : "flex-wrap",
        )}
      >
        {categories.map((category, index) => {
          const barColor = barCategoryColors.get(category.name)
          const lineColor = lineCategoryColors.get(category.name)
          return (
            <LegendItem
              key={`item-${index}`}
              name={category.name}
              chartType={category.chartType}
              onClick={onClickLegendItem}
              activeLegend={activeLegend}
              color={category.chartType === "bar" ? barColor : lineColor}
            />
          )
        })}
      </div>
      {enableLegendSlider && (hasScroll?.right || hasScroll?.left) ? (
        <>
          <div
            className={cx(
              // base
              "absolute top-0 right-0 bottom-0 flex h-full items-center justify-center pr-1",
              // background color
              "bg-white dark:bg-gray-950",
            )}
          >
            <ScrollButton
              icon={RiArrowLeftSLine}
              onClick={() => {
                setIsKeyDowned(null)
                scrollToTest("left")
              }}
              disabled={!hasScroll?.left}
            />
            <ScrollButton
              icon={RiArrowRightSLine}
              onClick={() => {
                setIsKeyDowned(null)
                scrollToTest("right")
              }}
              disabled={!hasScroll?.right}
            />
          </div>
        </>
      ) : null}
    </ol>
  )
})

Legend.displayName = "Legend"

const ChartLegend = (
  { payload },
  barCategoryColors,
  lineCategoryColors,
  setLegendHeight,
  activeLegend,
  onClick,
  enableLegendSlider,
  legendPosition,
  barYAxisWidth,
  lineYAxisWidth,
) => {
  const legendRef = React.useRef(null)

  useOnWindowResize(() => {
    const calculateHeight = (height) =>
      height ? Number(height) + 15 : 60
    setLegendHeight(calculateHeight(legendRef.current?.clientHeight))
  })

  const filteredPayload = payload.filter((item) => item.type !== "none")

  const paddingLeft =
    legendPosition === "left" && barYAxisWidth ? barYAxisWidth - 8 : 0
  const paddingRight =
    (legendPosition === "right" || legendPosition === undefined) &&
    lineYAxisWidth
      ? lineYAxisWidth - 8
      : 52

  return (
    <div
      style={{ paddingLeft: paddingLeft, paddingRight: paddingRight }}
      ref={legendRef}
      className={cx(
        "flex items-center",
        { "justify-center": legendPosition === "center" },
        {
          "justify-start": legendPosition === "left",
        },
        { "justify-end": legendPosition === "right" },
      )}
    >
      <Legend
        categories={filteredPayload.map((entry) => ({
          name: entry.value,
          chartType: entry.type === "rect" ? "bar" : entry.type,
        }))}
        barCategoryColors={barCategoryColors}
        lineCategoryColors={lineCategoryColors}
        onClickLegendItem={onClick}
        activeLegend={activeLegend}
        enableLegendSlider={enableLegendSlider}
      />
    </div>
  )
}

//#region Tooltip

const ChartTooltip = ({
  active,
  payload,
  label,
  barValueFormatter = (value) => value.toString(),
  lineValueFormatter = (value) => value.toString(),
}) => {
  if (active && payload && payload.length) {
    const filteredPayload = payload.filter((item) => item.type !== "none")
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
              // base
              "font-medium",
              // text color
              "text-gray-900 dark:text-gray-50",
            )}
          >
            {label}
          </p>
        </div>
        <div className={cx("space-y-1 px-4 py-2")}>
          {filteredPayload.map(
            ({ value, category, barColor, lineColor, chartType }, index) => (
              <div
                key={`id-${index}`}
                className="flex items-center justify-between space-x-8"
              >
                <div className="flex items-center space-x-2">
                  <div className="flex w-5 items-center justify-center">
                    <span
                      aria-hidden="true"
                      className={cx(
                        { "size-2 rounded-xs": chartType === "bar" },
                        {
                          "h-[3px] w-3.5 shrink-0 rounded-full":
                            chartType === "line",
                        },
                        "shrink-0",
                        getColorClassName(
                          chartType === "bar" ? barColor : lineColor,
                          "bg",
                        ),
                      )}
                    />
                  </div>
                  <p
                    className={cx(
                      // base
                      "text-right whitespace-nowrap",
                      // text color
                      "text-gray-700 dark:text-gray-300",
                    )}
                  >
                    {category}
                  </p>
                </div>
                <p
                  className={cx(
                    // base
                    "text-right font-medium whitespace-nowrap tabular-nums",
                    // text color
                    "text-gray-900 dark:text-gray-50",
                  )}
                >
                  {chartType === "bar"
                    ? barValueFormatter(value)
                    : lineValueFormatter(value)}
                </p>
              </div>
            ),
          )}
        </div>
      </div>
    )
  }
  return null
}

//#region ComboChart

const ComboChart = React.forwardRef(
  (props, forwardedRef) => {
    const defaultSeries = {
      categories: [],
      colors: AvailableChartColors,
      valueFormatter: (value) => value.toString(),
      showYAxis: true,
      yAxisWidth: 56,
      yAxisLabel: undefined,
      allowDecimals: true,
      type: "default",
      autoMinValue: false,
      minValue: undefined,
      maxValue: undefined,
    }

    const defaultBarSeries = defaultSeries
    const defaultLineSeries = {
      ...defaultSeries,
      connectNulls: false,
    }

    const {
      data = [],
      index,
      startEndOnly = false,
      showXAxis = true,
      showGridLines = true,
      intervalType = "equidistantPreserveStart",
      showTooltip = true,
      showLegend = true,
      legendPosition = "right",
      enableLegendSlider = false,
      onValueChange,
      tickGap = 5,
      xAxisLabel,
      enableBiaxial = false,

      barSeries = defaultBarSeries,
      lineSeries = defaultLineSeries,
      tooltipCallback,
      customTooltip,

      className,
      ...other
    } = props
    const mergedBarSeries = { ...defaultBarSeries, ...barSeries }
    const mergedLineSeries = { ...defaultLineSeries, ...lineSeries }

    const CustomTooltip = customTooltip

    const paddingValue =
      (!showXAxis &&
        !mergedBarSeries.showYAxis &&
        enableBiaxial &&
        !mergedLineSeries.showYAxis) ||
      (startEndOnly &&
        !mergedBarSeries.showYAxis &&
        enableBiaxial &&
        !mergedLineSeries.showYAxis)
        ? 0
        : 20
    const [legendHeight, setLegendHeight] = React.useState(60)
    const [activeDot, setActiveDot] = React.useState(undefined)
    const [activeLegend, setActiveLegend] = React.useState(undefined)

    const prevActiveRef = React.useRef(undefined)
    const prevLabelRef = React.useRef(undefined)

    const barCategoryColors = constructCategoryColors(
      mergedBarSeries.categories,
      mergedBarSeries.colors ?? AvailableChartColors,
    )
    const lineCategoryColors = constructCategoryColors(
      mergedLineSeries.categories,
      mergedLineSeries.colors ?? AvailableChartColors,
    )
    const [activeBar, setActiveBar] = React.useState(undefined)
    const barYAxisDomain = getYAxisDomain(
      mergedBarSeries.autoMinValue ?? false,
      mergedBarSeries.minValue,
      mergedBarSeries.maxValue,
    )
    const lineYAxisDomain = getYAxisDomain(
      mergedLineSeries.autoMinValue ?? false,
      mergedLineSeries.minValue,
      mergedLineSeries.maxValue,
    )
    const hasOnValueChange = !!onValueChange
    const stacked = barSeries.type === "stacked"

    function onBarClick(data, _, event) {
      event.stopPropagation()
      if (!onValueChange) return
      if (deepEqual(activeBar, { ...data.payload, value: data.value })) {
        setActiveLegend(undefined)
        setActiveBar(undefined)
        onValueChange?.(null)
      } else {
        setActiveLegend(data.tooltipPayload?.[0]?.dataKey)
        setActiveBar({
          ...data.payload,
          value: data.value,
        })
        onValueChange?.({
          eventType: "bar",
          categoryClicked: data.tooltipPayload?.[0]?.dataKey,
          ...data.payload,
        })
      }
    }

    function onDotClick(itemData, event) {
      event.stopPropagation()

      if (!hasOnValueChange) return
      if (
        (itemData.index === activeDot?.index &&
          itemData.dataKey === activeDot?.dataKey) ||
        (hasOnlyOneValueForKey(data, itemData.dataKey) &&
          activeLegend &&
          activeLegend === itemData.dataKey)
      ) {
        setActiveLegend(undefined)
        setActiveDot(undefined)
        onValueChange?.(null)
      } else {
        setActiveBar(undefined)
        setActiveLegend(itemData.dataKey)
        setActiveDot({
          index: itemData.index,
          dataKey: itemData.dataKey,
        })
        onValueChange?.({
          eventType: "dot",
          categoryClicked: itemData.dataKey,
          ...itemData.payload,
        })
      }
    }

    function onCategoryClick(dataKey) {
      if (!hasOnValueChange) return

      if (dataKey === activeLegend && !activeBar && !activeDot) {
        setActiveLegend(undefined)
        onValueChange?.(null)
      } else if (
        activeBar &&
        activeBar.tooltipPayload?.[0]?.dataKey === dataKey
      ) {
        setActiveLegend(dataKey)
        onValueChange?.({
          eventType: "category",
          categoryClicked: dataKey,
        })
      } else {
        setActiveLegend(dataKey)
        setActiveBar(undefined)
        setActiveDot(undefined)
        onValueChange?.({
          eventType: "category",
          categoryClicked: dataKey,
        })
      }
    }

    return (
      <div
        ref={forwardedRef}
        className={cx("h-80 w-full", className)}
        tremor-id="tremor-raw"
        {...other}
      >
        <ResponsiveContainer>
          <RechartsComposedChart
            data={data}
            onClick={
              hasOnValueChange && (activeLegend || activeBar || activeDot)
                ? () => {
                    setActiveBar(undefined)
                    setActiveDot(undefined)
                    setActiveLegend(undefined)
                    onValueChange?.(null)
                  }
                : undefined
            }
            margin={{
              bottom: xAxisLabel ? 30 : undefined,
              left: mergedBarSeries.yAxisLabel ? 20 : undefined,
              right: mergedLineSeries.yAxisLabel ? 20 : undefined,
              top: 5,
            }}
          >
            {showGridLines ? (
              <CartesianGrid
                className={cx("stroke-gray-200 stroke-1 dark:stroke-gray-800")}
                horizontal={true}
                vertical={false}
              />
            ) : null}
            <XAxis
              hide={!showXAxis}
              tick={{
                transform: "translate(0, 6)",
              }}
              fill=""
              stroke=""
              className={cx(
                // base
                "mt-4 text-xs",
                // text fill
                "fill-gray-500 dark:fill-gray-500",
              )}
              tickLine={false}
              axisLine={false}
              minTickGap={tickGap}
              padding={{
                left: paddingValue,
                right: paddingValue,
              }}
              dataKey={index}
              interval={startEndOnly ? "preserveStartEnd" : intervalType}
              ticks={
                startEndOnly
                  ? [data[0][index], data[data.length - 1][index]]
                  : undefined
              }
            >
              {xAxisLabel && (
                <Label
                  position="insideBottom"
                  offset={-20}
                  className="fill-gray-800 text-sm font-medium dark:fill-gray-200"
                >
                  {xAxisLabel}
                </Label>
              )}
            </XAxis>
            <YAxis
              yAxisId={enableBiaxial ? "left" : undefined}
              width={mergedBarSeries.yAxisWidth}
              hide={!mergedBarSeries.showYAxis}
              axisLine={false}
              tickLine={false}
              fill=""
              stroke=""
              className={cx(
                // base
                "text-xs",
                // text fill
                "fill-gray-500 dark:fill-gray-500",
              )}
              tick={{
                transform: "translate(-3, 0)",
              }}
              type="number"
              domain={barYAxisDomain}
              tickFormatter={mergedBarSeries.valueFormatter}
              allowDecimals={mergedBarSeries.allowDecimals}
            >
              {mergedBarSeries.yAxisLabel && (
                <Label
                  position="insideLeft"
                  style={{ textAnchor: "middle" }}
                  angle={-90}
                  offset={-15}
                  className="fill-gray-800 text-sm font-medium dark:fill-gray-200"
                >
                  {mergedBarSeries.yAxisLabel}
                </Label>
              )}
            </YAxis>

            {enableBiaxial ? (
              <YAxis
                yAxisId="right"
                orientation="right"
                width={mergedLineSeries.yAxisWidth}
                hide={!mergedLineSeries.showYAxis}
                axisLine={false}
                tickLine={false}
                fill=""
                stroke=""
                className={cx(
                  // base
                  "text-xs",
                  // text fill
                  "fill-gray-500 dark:fill-gray-500",
                )}
                tick={{
                  transform: "translate(3, 0)",
                }}
                type="number"
                domain={lineYAxisDomain}
                tickFormatter={mergedLineSeries.valueFormatter}
                allowDecimals={mergedLineSeries.allowDecimals}
              >
                {mergedLineSeries.yAxisLabel && (
                  <Label
                    position="insideRight"
                    style={{ textAnchor: "middle" }}
                    angle={-90}
                    offset={-15}
                    className="fill-gray-800 text-sm font-medium dark:fill-gray-200"
                  >
                    {mergedLineSeries.yAxisLabel}
                  </Label>
                )}
              </YAxis>
            ) : null}

            <Tooltip
              wrapperStyle={{ outline: "none" }}
              isAnimationActive={true}
              animationDuration={100}
              cursor={{ stroke: "#d1d5db", strokeWidth: 1 }}
              offset={20}
              position={{
                y: 0,
              }}
              content={({ active, payload, label }) => {
                const cleanPayload = payload
                  ? payload.map((item) => ({
                      category: item.dataKey,
                      value: item.value,
                      index: item.payload[index],
                      barColor: barCategoryColors.get(item.dataKey),
                      lineColor: lineCategoryColors.get(item.dataKey),
                      chartType: barCategoryColors.get(item.dataKey)
                        ? "bar"
                        : "line",
                      type: item.type,
                      payload: item.payload,
                    }))
                  : []

                if (
                  tooltipCallback &&
                  (active !== prevActiveRef.current ||
                    label !== prevLabelRef.current)
                ) {
                  tooltipCallback({ active, payload: cleanPayload, label })
                  prevActiveRef.current = active
                  prevLabelRef.current = label
                }

                return showTooltip && active ? (
                  CustomTooltip ? (
                    <CustomTooltip
                      active={active}
                      payload={cleanPayload}
                      label={label}
                    />
                  ) : (
                    <ChartTooltip
                      active={active}
                      payload={cleanPayload}
                      label={label}
                      barValueFormatter={mergedBarSeries.valueFormatter}
                      lineValueFormatter={mergedLineSeries.valueFormatter}
                    />
                  )
                ) : null
              }}
            />
            {showLegend ? (
              <RechartsLegend
                verticalAlign="top"
                height={legendHeight}
                content={({ payload }) =>
                  ChartLegend(
                    { payload },
                    barCategoryColors,
                    lineCategoryColors,
                    setLegendHeight,
                    activeLegend,
                    hasOnValueChange
                      ? (clickedLegendItem) =>
                          onCategoryClick(clickedLegendItem)
                      : undefined,
                    enableLegendSlider,
                    legendPosition,
                    mergedBarSeries.yAxisWidth,
                    mergedLineSeries.yAxisWidth,
                  )
                }
              />
            ) : null}
            {mergedBarSeries.categories.map((category) => (
              <Bar
                yAxisId={enableBiaxial ? "left" : undefined}
                className={cx(
                  getColorClassName(barCategoryColors.get(category), "fill"),
                  onValueChange ? "cursor-pointer" : "",
                )}
                key={category}
                name={category}
                type="linear"
                dataKey={category}
                stackId={stacked ? "stack" : undefined}
                isAnimationActive={false}
                fill=""
                shape={(props) =>
                  renderShape(props, activeBar, activeLegend)
                }
                onClick={onBarClick}
              />
            ))}
            {/* hidden lines to increase clickable target area */}
            {onValueChange
              ? mergedLineSeries.categories.map((category) => (
                  <Line
                    yAxisId={enableBiaxial ? "right" : undefined}
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
                    connectNulls={mergedLineSeries.connectNulls}
                    onClick={(props, event) => {
                      event.stopPropagation()
                      const { name } = props
                      onCategoryClick(name)
                    }}
                  />
                ))
              : null}
            {mergedLineSeries.categories.map((category) => (
              <Line
                yAxisId={enableBiaxial ? "right" : undefined}
                className={cx(
                  getColorClassName(lineCategoryColors.get(category), "stroke"),
                  hasOnValueChange && "cursor-pointer",
                )}
                strokeOpacity={
                  activeDot || (activeLegend && activeLegend !== category)
                    ? 0.3
                    : 1
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
                        getColorClassName(lineCategoryColors.get(dataKey), "fill"),
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
                          getColorClassName(lineCategoryColors.get(dataKey), "fill"),
                        )}
                      />
                    )
                  }
                  return <React.Fragment key={index}></React.Fragment>
                }}
                key={`${category}-line-id`}
                name={category}
                type="linear"
                dataKey={category}
                stroke=""
                strokeWidth={2}
                strokeLinejoin="round"
                strokeLinecap="round"
                isAnimationActive={false}
                connectNulls={mergedLineSeries.connectNulls}
                onClick={(props, event) => {
                  event.stopPropagation()
                  const { name } = props
                  onCategoryClick(name)
                }}
              />
            ))}
          </RechartsComposedChart>
        </ResponsiveContainer>
      </div>
    )
  },
)

ComboChart.displayName = "ComboChart"

export { ComboChart, ChartTooltip, Legend }