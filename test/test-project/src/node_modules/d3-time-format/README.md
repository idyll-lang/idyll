# d3-time-format

This module provides a JavaScript implementation of the venerable [strptime](http://pubs.opengroup.org/onlinepubs/009695399/functions/strptime.html) and [strftime](http://pubs.opengroup.org/onlinepubs/007908799/xsh/strftime.html) functions from the C standard library, and can be used to parse or format [dates](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) in a variety of locale-specific representations. To format a date, create a [*format* function](#_format) from a [format specifier](#locale_format) (a string with the desired format *directives*, indicated by `%`); then pass a date to the format function, which returns a string. For example, to convert the current date to a human-readable string:

```js
var f = d3_time_format.format("%B %d, %Y");
f(new Date); // "June 30, 2015"
```

Format functions also support parsing as [*format*.parse](#format_parse), so to convert a string back to a date:

```js
var f = d3_time_format.format("%B %d, %Y");
f.parse("June 30, 2015"); // Tue Jun 30 2015 00:00:00 GMT-0700 (PDT)
```

You can implement more elaborate conditional time formats, too. For example, here’s a [multi-scale time format](http://bl.ocks.org/mbostock/4149176) using [time intervals](https://github.com/d3/d3-time):

```js
var formatMillisecond = d3_time_format.format(".%L"),
    formatSecond = d3_time_format.format(":%S"),
    formatMinute = d3_time_format.format("%I:%M"),
    formatHour = d3_time_format.format("%I %p"),
    formatDay = d3_time_format.format("%a %d"),
    formatWeek = d3_time_format.format("%b %d"),
    formatMonth = d3_time_format.format("%B"),
    formatYear = d3_time_format.format("%Y");

function multiFormat(date) {
  return (d3_time.second(date) < date ? formatMillisecond
      : d3_time.minute(date) < date ? formatSecond
      : d3_time.hour(date) < date ? formatMinute
      : d3_time.day(date) < date ? formatHour
      : d3_time.month(date) < date ? (d3_time.week(date) < date ? formatDay : formatWeek)
      : d3_time.year(date) < date ? formatMonth
      : formatYear)(date);
}
```

This module is used by D3 [time scales](https://github.com/d3/d3-scales#time-scales) to generate human-readable ticks.

## Installing

If you use NPM, `npm install d3-time-format`. Otherwise, download the [latest release](https://github.com/d3/d3-time-format/releases/latest). The released bundle supports AMD, CommonJS, and vanilla environments. Create a custom build using [Rollup](https://github.com/rollup/rollup) or your preferred bundler. You can also load directly from [d3js.org](https://d3js.org):

```html
<script src="https://d3js.org/d3-time.v0.1.min.js"></script>
<script src="https://d3js.org/d3-time-format.v0.2.min.js"></script>
```

In a vanilla environment, a `d3_time_format` global is exported. [Try d3-time-format in your browser.](https://tonicdev.com/npm/d3-time-format)

## API Reference

<a name="format" href="#format">#</a> d3_time_format.<b>format</b>(<i>specifier</i>)

An alias for [*locale*.format](#locale_format) on the [U.S. English locale](#localeEnUs). See the other [locales](#locales), or use [locale](#locale) to define a new locale.

<a name="utcFormat" href="#utcFormat">#</a> d3_time_format.<b>utcFormat</b>(<i>specifier</i>)

An alias for [*locale*.utcFormat](#locale_utcFormat) on the [U.S. English locale](#localeEnUs). See the other [locales](#locales), or use [locale](#locale) to define a new locale.

<a name="isoFormat" href="#isoFormat">#</a> d3_time_format.<b>isoFormat</b>

The full [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) UTC time [*format* function](#_format). Where available, this method will use [Date.toISOString](https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Date/toISOString) to format and the [Date constructor](https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Date) to parse strings. If you depend on strict validation of the input format according to ISO 8601, you should construct a [UTC format](#utcFormat):

```js
var isoFormat = d3_time_format.utcFormat("%Y-%m-%dT%H:%M:%S.%LZ");
```

<a name="locale_format" href="#locale_format">#</a> <i>locale</i>.<b>format</b>(<i>specifier</i>)

Returns a new [*format* function](#_format) for the given string *specifier*. The specifier string may contain the following directives:

* `%a` - abbreviated weekday name.*
* `%A` - full weekday name.*
* `%b` - abbreviated month name.*
* `%B` - full month name.*
* `%c` - the locale’s date and time, such as `%a %b %e %H:%M:%S %Y`.*
* `%d` - zero-padded day of the month as a decimal number [01,31].
* `%e` - space-padded day of the month as a decimal number [ 1,31]; equivalent to `%_d`.
* `%H` - hour (24-hour clock) as a decimal number [00,23].
* `%I` - hour (12-hour clock) as a decimal number [01,12].
* `%j` - day of the year as a decimal number [001,366].
* `%m` - month as a decimal number [01,12].
* `%M` - minute as a decimal number [00,59].
* `%L` - milliseconds as a decimal number [000, 999].
* `%p` - either AM or PM.*
* `%S` - second as a decimal number [00,61].
* `%U` - Sunday-based week of the year as a decimal number [00,53].
* `%w` - Sunday-based weekday as a decimal number [0,6].
* `%W` - Monday-based week of the year as a decimal number [00,53].
* `%x` - the locale’s date, such as `%m/%d/%Y`.*
* `%X` - the locale’s time, such as `%H:%M:%S`.*
* `%y` - year without century as a decimal number [00,99].
* `%Y` - year with century as a decimal number.
* `%Z` - time zone offset, such as `-0700`, `-07:00`, `-07`, or `Z`.
* `%%` - a literal percent sign (`%`).

Directives marked with an asterisk (*) may be affected by the [locale definition](#localeFormat). For `%U`, all days in a new year preceding the first Sunday are considered to be in week 0. For `%W`, all days in a new year preceding the first Monday are considered to be in week 0. Week numbers are computed using [*interval*.count](https://github.com/d3/d3-time#interval_count).

The `%` sign indicating a directive may be immediately followed by a padding modifier:

* `0` - zero-padding
* `_` - space-padding
* `-` - disable padding

If no padding modifier is specified, the default is `0` for all directives except `%e`, which defaults to `_`. (In some implementations of strftime and strptime, a directive may include an optional field width or precision; this feature is not yet implemented.)

<a name="locale_utcFormat" href="#locale_utcFormat">#</a> <i>locale</i>.<b>utcFormat</b>(<i>specifier</i>)

Equivalent to [*locale*.format](#locale_format), except all directives are interpreted as [Coordinated Universal Time (UTC)](https://en.wikipedia.org/wiki/Coordinated_Universal_Time) rather than local time.

<a name="_format" href="#_format">#</a> <i>format</i>(<i>date</i>)

Formats the specified *[date](https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Date)*, returning the corresponding string.

```javascript
var formatMonth = d3_time_format.format("%B"),
    formatDay = d3_time_format.format("%A"),
    date = new Date(2014, 4, 1); // Thu May 01 2014 00:00:00 GMT-0700 (PDT)

formatMonth(date); // "May"
formatDay(date); // "Thursday"
```

<a name="format_parse" href="#format_parse">#</a> <i>format</i>.<b>parse</b>(<i>string</i>)

Parses the specified *string*, returning the corresponding [date](https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Date) or null if the string could not be parsed according to this format’s specifier.

Parsing is strict: if the specified <i>string</i> does not exactly match the associated specifier, this method returns null. For example, if the associated specifier is `%Y-%m-%dT%H:%M:%SZ`, then the string `"2011-07-01T19:15:28Z"` will be parsed as expected, but `"2011-07-01T19:15:28"`, `"2011-07-01 19:15:28"` and `"2011-07-01"` will return null. (Note that the literal `Z` here is different from the time zone offset directive `%Z`.) If a more flexible parser is desired, try multiple formats sequentially until one returns non-null.

The `%d` and `%e` directives are considered equivalent for parsing.

<a name="format_toString" href="#format_toString">#</a> <i>format</i>.<b>toString</b>()

Returns this format’s specifier.

### Locales

<a name="locale" href="#locale">#</a> d3_time_format.<b>locale</b>(<i>definition</i>)

Returns a *locale* object for the specified *definition* with [*locale*.format](#locale_format) and [*locale*.utcFormat](#locale_utcFormat) methods. The *definition* must include the following properties:

* `dateTime` - the date and time (`%c`) format specifier (<i>e.g.</i>, `"%a %b %e %X %Y"`).
* `date` - the date (`%x`) format specifier (<i>e.g.</i>, `"%m/%d/%Y"`).
* `time` - the time (`%X`) format specifier (<i>e.g.</i>, `"%H:%M:%S"`).
* `periods` - the A.M. and P.M. equivalents (<i>e.g.</i>, `["AM", "PM"]`).
* `days` - the full names of the weekdays, starting with Sunday.
* `shortDays` - the abbreviated names of the weekdays, starting with Sunday.
* `months` - the full names of the months (starting with January).
* `shortMonths` - the abbreviated names of the months (starting with January).

<a name="localeCaEs" href="#localeCaEs">#</a> d3_time_format.<b>localeCaEs</b>

[Catalan (Spain)](https://github.com/d3/d3-time-format/tree/master/src/locale/ca-ES.js)

<a name="localeDeCh" href="#localeDeCh">#</a> d3_time_format.<b>localeDeCh</b>

[German (Switzerland)](https://github.com/d3/d3-time-format/tree/master/src/locale/de-CH.js)

<a name="localeDeDe" href="#localeDeDe">#</a> d3_time_format.<b>localeDeDe</b>

[German (Germany)](https://github.com/d3/d3-time-format/tree/master/src/locale/de-DE.js)

<a name="localeEnCa" href="#localeEnCa">#</a> d3_time_format.<b>localeEnCa</b>

[English (Canada)](https://github.com/d3/d3-time-format/tree/master/src/locale/en-CA.js)

<a name="localeEnGb" href="#localeEnGb">#</a> d3_time_format.<b>localeEnGb</b>

[English (United Kingdom)](https://github.com/d3/d3-time-format/tree/master/src/locale/en-GB.js)

<a name="localeEnUs" href="#localeEnUs">#</a> d3_time_format.<b>localeEnUs</b>

[English (United States)](https://github.com/d3/d3-time-format/tree/master/src/locale/en-US.js)

<a name="localeEsEs" href="#localeEsEs">#</a> d3_time_format.<b>localeEsEs</b>

[Spanish (Spain)](https://github.com/d3/d3-time-format/tree/master/src/locale/es-ES.js)

<a name="localeFiFi" href="#localeFiFi">#</a> d3_time_format.<b>localeFiFi</b>

[Finnish (Finland)](https://github.com/d3/d3-time-format/tree/master/src/locale/fi-FI.js)

<a name="localeFrCa" href="#localeFrCa">#</a> d3_time_format.<b>localeFrCa</b>

[French (Canada)](https://github.com/d3/d3-time-format/tree/master/src/locale/fr-CA.js)

<a name="localeFrFr" href="#localeFrFr">#</a> d3_time_format.<b>localeFrFr</b>

[French (France)](https://github.com/d3/d3-time-format/tree/master/src/locale/fr-FR.js)

<a name="localeHeIl" href="#localeHeIl">#</a> d3_time_format.<b>localeHeIl</b>

[Hebrew (Israel)](https://github.com/d3/d3-time-format/tree/master/src/locale/he-IL.js)

<a name="localeHuHu" href="#localeHuHu">#</a> d3_time_format.<b>localeHuHu</b>

[Hungarian (Hungary)](https://github.com/d3/d3-time-format/tree/master/src/locale/hu-HU.js)

<a name="localeItIt" href="#localeItIt">#</a> d3_time_format.<b>localeItIt</b>

[Italian (Italy)](https://github.com/d3/d3-time-format/tree/master/src/locale/it-IT.js)

<a name="localeJaJp" href="#localeJaJp">#</a> d3_time_format.<b>localeJaJp</b>

[Japanese (Japan)](https://github.com/d3/d3-time-format/tree/master/src/locale/ja-JP.js)

<a name="localeKoKr" href="#localeKoKr">#</a> d3_time_format.<b>localeKoKr</b>

[Korean (South Korea)](https://github.com/d3/d3-time-format/tree/master/src/locale/ko-KR.js)

<a name="localeMkMk" href="#localeMkMk">#</a> d3_time_format.<b>localeMkMk</b>

[Macedonian (Macedonia)](https://github.com/d3/d3-time-format/tree/master/src/locale/mk-MK.js)

<a name="localeNlNl" href="#localeNlNl">#</a> d3_time_format.<b>localeNlNl</b>

[Dutch (Netherlands)](https://github.com/d3/d3-time-format/tree/master/src/locale/nl-NL.js)

<a name="localePlPl" href="#localePlPl">#</a> d3_time_format.<b>localePlPl</b>

[Polish (Poland)](https://github.com/d3/d3-time-format/tree/master/src/locale/pl-PL.js)

<a name="localePtBr" href="#localePtBr">#</a> d3_time_format.<b>localePtBr</b>

[Portuguese (Brazil)](https://github.com/d3/d3-time-format/tree/master/src/locale/pt-BR.js)

<a name="localeRuRu" href="#localeRuRu">#</a> d3_time_format.<b>localeRuRu</b>

[Russian (Russia)](https://github.com/d3/d3-time-format/tree/master/src/locale/ru-RU.js)

<a name="localeSvSe" href="#localeSvSe">#</a> d3_time_format.<b>localeSvSe</b>

[Swedish (Sweden)](https://github.com/d3/d3-time-format/tree/master/src/locale/sv-SE.js)

<a name="localeZhCn" href="#localeZhCn">#</a> d3_time_format.<b>localeZhCn</b>

[Chinese (China)](https://github.com/d3/d3-time-format/tree/master/src/locale/zh-CN.js)
