import { assetIcons } from './assets';
import {
  weatherCodeToIcon,
  weatherCodeToBigIcon,
  weatherCodeToWeather,
  formatTime24,
} from './utils/weatherUtils';
import LocationSearch, { LocationIQSuggestion } from './components/search';
import { useWeather } from './hooks/useWeather';

export default function App() {
  const {
    weatherData,
    isLoading,
    isRefetching,
    setLocation,
    locationAddress,
    setLocationAddress,
    tempUnit,
    setTempUnit,
    formatTemperature,
  } = useWeather();

  const handleLocationSelect = (locationData: LocationIQSuggestion): void => {
    const latitude = parseFloat(locationData.lat);
    const longitude = parseFloat(locationData.lon);

    setLocation({ lat: latitude, lon: longitude });
    setLocationAddress(
      locationData.address.name || locationData.address.city + ', ' + locationData.address.country
    );
  };

  const sunrise = formatTime24(
    weatherData?.daily?.sunrise || BigInt(0),
    weatherData?.timezone || 'UTC'
  );
  const sunset = formatTime24(
    weatherData?.daily?.sunset || BigInt(0),
    weatherData?.timezone || 'UTC'
  );

  return (
    <div className="min-h-screen bg-gradient-to-t from-[#012B69]/52 via-[#012561]/72 to-[#00235D] p-4 md:p-8 lg:p-12">
      <div className="w-full flex justify-end flex-wrap gap-x-4 gap-y-2 mb-8 font-rubik">
        <span
          onClick={() => setTempUnit((prev) => (prev === 'C' ? 'F' : 'C'))}
          className="text-[#CCCCCC] border border-white/30 rounded-lg w-[200px] h-[40px] flex items-center justify-start px-4 py-2 gap-[2px] cursor-pointer"
        >
          <span>Temperature Unit: °{tempUnit}</span>{' '}
          <img src={assetIcons.dropdown} className="w-2 h-2" />
        </span>
        <LocationSearch assetIcons={assetIcons} onSelect={handleLocationSelect} />
      </div>
      <div className="max-w-6xl mx-auto flex flex-col justify-start items-center gap-[40px]">
        <div className=" w-full flex flex-wrap justify-center items-center gap-[26px]">
          <div className=" h-[295px] min-w-[288px] overflow-hidden sm:min-w-[320px] md:max-w-[450px] p-6  flex-1 flex flex-col justify-start items-start bg-[linear-gradient(270deg,rgba(23,38,92,0.6)-6.38%,rgba(2,110,189,0.408)107.1%)] rounded-[16px] pb-[34px] ">
            {isLoading || isRefetching ? (
              <div className="w-full h-full flex justify-center items-center">
                {' '}
                <div className="w-6 h-6 border-4 border-white rounded-full border-t-transparent animate-spin"></div>{' '}
              </div>
            ) : (
              <>
                <div className="w-full flex flex-row justify-end items-start">
                  <img src={assetIcons.locationPin} className="w-[16px] object-fill mr-3" />
                  <span className="text-[16px]  text-end text-white tracking-[0.03em]">
                    {locationAddress}
                  </span>
                </div>
                <div className="w-full flex flex-col justify-start items-start gap-4">
                  <div className="relative">
                    <img
                      src={weatherCodeToBigIcon(weatherData?.current.weatherCode || 0)}
                      className="w-[100px]"
                    />
                    <div className="absolute w-[55px] h-[55px] top-0 mx-auto bg-[#FFEF9A] blur-[38.5px] rounded-full" />
                  </div>
                  <span className="tracking-[0.05em]  text-white h-[61px] text-[50px] leading-[100%]">
                    {Math.round(formatTemperature(weatherData?.current.temperature2m || 0))}
                    <span className="h-[50px] leading-[100%] translate-x-[-5px] text-[50px] translate-y-[-8px] absolute ">
                      °
                    </span>
                    <span
                      className="h-[50px] leading-[100%] translate-x-[12px] text-[50px] translate-y-[-15px] absolute lowercase"
                    >
                      {tempUnit}
                    </span>
                  </span>
                  <div className="w-full flex flex-row justify-start items-center gap-2">
                    <img
                      src={weatherCodeToIcon(weatherData?.current.weatherCode || 0)}
                      className="h-[22px] object-fill"
                    />
                    <span className="tracking-[0.03em] text-white h-[19px] text-[16px] leading-[100%]">
                      {weatherCodeToWeather(weatherData?.current.weatherCode || 0)}
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="flex-1 flex flex-row flex-wrap sm:flex-nowrap min-w-[288px] sm:min-w-[320px] md:max-w-[450px] justify-center items-center gap-[26px]">
            <div className="pt-6 pb-8 relative px-4 h-[295px] md:max-w-[215px] min-w-[160px] flex-1 flex flex-col justify-start items-start bg-[linear-gradient(270deg,rgba(23,38,92,0.6)-6.38%,rgba(2,110,189,0.408)107.1%)] rounded-[16px]">
              {isLoading || isRefetching ? (
                <div className="w-full h-full flex justify-center items-center">
                  {' '}
                  <div className="w-6 h-6 border-4 border-white rounded-full border-t-transparent animate-spin"></div>{' '}
                </div>
              ) : (
                <>
                  <div className="w-full flex flex-row justify-start items-start gap-2">
                    <img src={assetIcons.sunrise} className="w-[21px] h-[17px] object-fill " />

                    <span className="w-16 h-[17px]  font-medium text-sm leading-[17px] flex items-center tracking-[0.03em] uppercase text-white/75">
                      SUNRISE
                    </span>
                  </div>
                  <span className=" font-normal text-[32px] mt-6 leading-[39px] tracking-[0.05em] text-white">
                    {' '}
                    {sunrise.hours > 12 ? sunrise.hours - 12 : sunrise.hours}:{sunrise.minutes}{' '}
                    <br />
                    {sunrise.hours >= 12 ? ' PM' : ' AM'}
                  </span>
                  <img
                    src={assetIcons.sunriseLine}
                    className="mt-2 w-[135px] h-[35px] object-fill "
                  />

                  <span className=" absolute bottom-[32px] font-regular  text-base leading-[19px] tracking-[0.05em] text-white">
                    Sunset: {sunset.hours > 12 ? sunset.hours - 12 : sunset.hours}:{sunset.minutes}
                    {sunset.hours >= 12 ? ' PM' : ' AM'}
                  </span>
                </>
              )}
            </div>

            <div className="pt-6 pb-8 relative px-4 h-[295px] md:max-w-[215px] min-w-[160px] flex-1 flex flex-col justify-start items-start bg-[linear-gradient(270deg,rgba(23,38,92,0.6)-6.38%,rgba(2,110,189,0.408)107.1%)] rounded-[16px]">
              {isLoading || isRefetching ? (
                <div className="w-full h-full flex justify-center items-center">
                  {' '}
                  <div className="w-6 h-6 border-4 border-white rounded-full border-t-transparent animate-spin"></div>{' '}
                </div>
              ) : (
                <>
                  <div className="w-full flex flex-row justify-start items-start gap-2">
                    <img src={assetIcons.raindrop} className="h-[17px] object-fill " />

                    <span className="w-16 h-[17px]  font-medium text-sm leading-[17px] flex items-center tracking-[0.03em] uppercase text-white/75">
                      RAINFALL
                    </span>
                  </div>
                  <span className=" font-normal text-[32px] mt-6 tracking-[0.05em]  text-white">
                    {weatherData?.daily.rainSum[0].toPrecision(3)} MM
                  </span>
                  <span className="text-[12px] font-medium text-white">in last 24h</span>

                  <span className=" absolute bottom-[32px] text-wrap font-normal text-[16px] text-white pr-4">
                    Next expexted is
                    {(() => {
                      const rainDay = [1, 2, 3, 4, 5].find(
                        (index) => weatherData?.daily?.rainSum[index] || 0 > 0
                      );

                      return rainDay !== undefined
                        ? ` ${weatherData?.daily?.rainSum[rainDay].toPrecision(3)}mm on ${new Date(
                            weatherData!.daily!.time[rainDay]
                          ).toLocaleDateString('en-US', { weekday: 'short' })}`
                        : ' not in the next 5 days';
                    })()}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className=" max-w-[930px] w-full flex flex-col justify-center items-center p-4  rounded-[16px] bg-gradient-to-l from-[rgba(23,38,92,0.6)] to-[rgba(2,110,189,0.408)] ">
          <span className=" w-full font-normal text-xs leading-[15px] flex items-center uppercase text-white border-b pb-2 border-white/30">
            CONDITION THROUGHOUT TODAY
          </span>
          {isLoading || isRefetching ? (
            <div className="w-full h-full flex justify-center items-center">
              {' '}
              <div className="w-6 h-6 border-4 border-white rounded-full border-t-transparent animate-spin"></div>{' '}
            </div>
          ) : (
            <div className="w-full grid  grid-cols-5 lg:grid-cols-15 gap-2 pt-4">
              <div className="w-full flex flex-col justify-between items-center gap-2 max-h-[86px] mb-4 lg:mb-0">
                <span className=" font-medium text-base leading-[100%] flex items-center text-white">
                  Now
                </span>

                <img
                  src={weatherCodeToIcon(weatherData?.current.weatherCode || 0)}
                  className="w-[27px] object-fill"
                />

                <span className=" text-white font-medium text-base leading-[19px] tracking-[0.05em]">
                  {Math.round(formatTemperature(weatherData?.current.temperature2m || 0))}°
                </span>
              </div>
              <div className="w-full flex flex-col justify-between items-center gap-2 max-h-[86px] mb-4 lg:mb-0">
                <span className="flex justify-center items-center gap-[2px]">
                  <span className="  font-medium text-base leading-[100%] flex items-center text-white">
                    {sunrise.hours > 12 ? sunrise.hours - 12 : sunrise.hours}:{sunrise.minutes}{' '}
                    <br />
                  </span>
                  <span className=" font-medium text-xs leading-[15px] flex items-center text-white">
                    {sunrise.hours >= 12 ? 'PM' : 'AM'}
                  </span>
                </span>

                <img src={assetIcons.sunRiseYellow} className="w-[27px] object-fill" />

                <span className=" text-white font-bold text-base leading-[19px] tracking-[0.05em]">
                  Sunrise
                </span>
              </div>
              {/* Hour entries from 6 AM to 5 PM */}
              {[6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17].map((hour, index: number) => (
                <div
                  key={hour}
                  className="w-full flex flex-col justify-between items-center gap-2 max-h-[86px] mb-4 lg:mb-0"
                >
                  <span className="flex justify-center items-center gap-[2px]">
                    <span className=" font-medium text-base leading-[100%] flex items-center text-white">
                      {hour % 12 || 12}
                    </span>
                    <span className=" font-medium text-xs leading-[15px] flex items-center text-white">
                      {hour >= 12 ? 'PM' : 'AM'}
                    </span>
                  </span>
                  <img
                    src={weatherCodeToIcon(weatherData?.hourly.weatherCode[index] || 0)}
                    className="w-[27px] object-fill"
                  />
                  <span className=" text-white font-medium text-base leading-[19px] tracking-[0.05em]">
                    {Math.round(formatTemperature(weatherData?.hourly.temperature2m[index] || 0))}°
                    {tempUnit}
                  </span>
                </div>
              ))}
              <div className="w-full flex flex-col justify-between items-center gap-2 max-h-[86px] mb-4 lg:mb-0">
                <span className="flex justify-center items-center gap-[2px]">
                  <span className="  font-medium text-base leading-[100%] flex items-center text-white">
                    {sunset.hours > 12 ? sunset.hours - 12 : sunset.hours}:{sunset.minutes}
                  </span>
                  <span className=" font-medium text-xs leading-[15px] flex items-center text-white">
                    {sunset.hours >= 12 ? 'PM' : 'AM'}
                  </span>
                </span>

                <img src={assetIcons.sunSet} className="w-[27px] object-fill" />

                <span className=" text-white font-bold text-base leading-[19px] tracking-[0.05em]">
                  Sunset
                </span>
              </div>
            </div>
          )}
        </div>
        <div className=" w-full flex flex-wrap justify-center items-center gap-[26px]">
          <div className=" h-[295px] min-w-[288px] sm:min-w-[320px] md:max-w-[450px] p-6  flex-1 flex flex-col justify-start items-start rounded-[16px] pb-[34px] bg-gradient-to-t from-[rgba(1,24,78,0.444)] from-15.42% via-[rgba(1,37,97,0.462)] via-54.1% to-[rgba(0,29,87,0.45)] to-92.97%">
            <div className="w-full flex flex-row justify-start items-start border-b border-white/30 pb-2">
              <span className=" font-normal text-[12px] leading-[15px] text-start uppercase text-white">
                5-day Forecast
              </span>
            </div>
            {isLoading || isRefetching ? (
              <div className="w-full h-full flex justify-center items-center">
                {' '}
                <div className="w-6 h-6 border-4 border-white rounded-full border-t-transparent animate-spin"></div>{' '}
              </div>
            ) : (
              <div className="w-full  h-full grid grid-rows-5 pt-6">
                <div className="w-full flex flex-row justify-between items-center">
                  <span className=" w-[43px] font-medium text-[16px] leading-[19px] text-start  text-white">
                    Today
                  </span>
                  <img
                    src={weatherCodeToIcon(weatherData?.daily.weatherCode[0] || 0)}
                    className="w-[20px] object-fill"
                  />
                  <div className="flex w-1/2 lg:w-[fit]  flex-row justify-between gap-3 items-center">
                    <span className=" font-medium text-[16px] leading-[19px] text-start tracking-[0.05em] text-white/80">
                      {Math.round(formatTemperature(weatherData?.daily.temperature2mMin[0] || 0))}°
                    </span>
                    <div className="w-full lg:w-[130px] h-[4px] rounded-[10px] bg-gradient-to-r from-[#B7FF7E] from-24.85% via-[#FFE458] via-60.9% to-[#FFE458]" />
                    <span className=" font-medium text-[16px] leading-[19px] text-start tracking-[0.05em] text-white">
                      {Math.round(formatTemperature(weatherData?.daily.temperature2mMax[0] || 0))}°
                    </span>
                  </div>
                </div>
                {[...Array(4)].map((_, index) => {
                  const dayIndex = index + 1;
                  const date = new Date(weatherData?.daily.time[dayIndex] || new Date());
                  const dayName = date.toLocaleDateString('en-US', {
                    weekday: 'short',
                  });
                  const weatherCode = weatherData?.daily.weatherCode[dayIndex];

                  return (
                    <div key={index} className="  flex flex-row justify-between items-center">
                      <span className=" w-[43px] font-medium text-[16px] leading-[19px] text-start text-white">
                        {dayName}
                      </span>
                      <img
                        src={weatherCodeToIcon(weatherCode || 0)}
                        className="w-[20px] object-fill"
                      />
                      <div className="flex w-1/2 lg:w-[fit] flex-row justify-between gap-3 items-center">
                        <span className=" font-medium text-[16px] leading-[19px] text-start tracking-[0.05em] text-white/80">
                          {Math.round(
                            formatTemperature(weatherData?.daily.temperature2mMin[dayIndex] || 0)
                          )}
                          °
                        </span>
                        <div className="w-full lg:w-[130px]  h-[4px] rounded-[10px] bg-gradient-to-r from-[#B7FF7E] from-24.85% via-[#FFE458] via-60.9% to-[#FFE458]" />
                        <span className=" font-medium text-[16px] leading-[19px] text-start tracking-[0.05em] text-white">
                          {Math.round(
                            formatTemperature(weatherData?.daily.temperature2mMax[dayIndex] || 0)
                          )}
                          °
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex-1 flex flex-row flex-wrap sm:flex-nowrap min-w-[288px] sm:min-w-[320px] md:max-w-[450px] justify-center items-center gap-[26px]">
            <div className="pt-6 pb-8 relative px-4 h-[295px] md:max-w-[215px] min-w-[160px] flex-1 flex flex-col justify-start items-start bg-[linear-gradient(270deg,rgba(23,38,92,0.6)-6.38%,rgba(2,110,189,0.408)107.1%)] rounded-[16px]">
              {isLoading || isRefetching ? (
                <div className="w-full h-full flex justify-center items-center">
                  {' '}
                  <div className="w-6 h-6 border-4 border-white rounded-full border-t-transparent animate-spin"></div>{' '}
                </div>
              ) : (
                <>
                  <div className="w-full flex flex-row justify-start items-start gap-2">
                    <img src={assetIcons.humidity} className="w-[21px] h-[17px] object-fill " />

                    <span className="w-16 h-[17px]  font-medium text-sm leading-[17px] flex items-center tracking-[0.03em] uppercase text-white/75">
                      HUMIDITY
                    </span>
                  </div>
                  <span className="font-normal text-[32px] mt-6 leading-[39px] tracking-[0.05em] text-white">
                    {weatherData?.current.relativeHumidity2m || 0} %
                  </span>

                  <span className=" absolute bottom-[32px] font-normal  text-base leading-[19px] text-white pr-4">
                    The dew point is{' '}
                    {Math.round(formatTemperature(weatherData?.hourly.dewPoint2m[0] || 0))}°
                    {tempUnit} right now.
                  </span>
                </>
              )}
            </div>

            <div className="pt-6 pb-8 relative px-4 h-[295px] md:max-w-[215px] min-w-[160px] flex-1 flex flex-col justify-start items-start bg-[linear-gradient(270deg,rgba(23,38,92,0.6)-6.38%,rgba(2,110,189,0.408)107.1%)] rounded-[16px]">
              {isLoading || isRefetching ? (
                <div className="w-full h-full flex justify-center items-center">
                  {' '}
                  <div className="w-6 h-6 border-4 border-white rounded-full border-t-transparent animate-spin"></div>{' '}
                </div>
              ) : (
                <>
                  <div className="w-full flex flex-row justify-start items-start gap-2">
                    <img src={assetIcons.wind} className="h-[17px] object-fill " />

                    <span className="w-16 h-[17px]  font-medium text-sm leading-[17px] flex items-center tracking-[0.03em] uppercase text-white/75">
                      WIND
                    </span>
                  </div>
                  <div className="w-full flex flex-row justify-start items-center mt-6">
                    <span className=" font-normal text-[32px] tracking-[0.05em]  text-white">
                      {(weatherData?.current.windSpeed10m || 0).toFixed(2)}
                    </span>
                    <span className=" font-normal text-[12px]  text-white">KM/H</span>
                  </div>

                  <span className=" absolute bottom-[32px] font-normal  text-base leading-[19px] text-white pr-4">
                    Time now: {weatherData?.current.time.toFormat('h:mm a')}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
