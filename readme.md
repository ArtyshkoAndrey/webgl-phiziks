# Программа для работы с атомами на WebGL + Поддержка MOPAC

Реализованно на Vue.JS, Electron.JS, Three.JS

## Установка

Использутей пакетный менеджер [yarn](https://yarnpkg.com/lang/en/) для установки.

```bash
yarn
```

## Использование

```bash
yarn run dev
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## Last Fixed
### 12.04.19
* Дизайн переписан под Google Material
* Убраны утечки памяти слушателей
* Код переписан на ES6 - ES7
* За место массивов атомом используется Set()
* Добавлена поддежка добавления атома
* Добавлены атомы из википедии, цвет имя символ радиус и т.п.
* Дабавлена 2 режима в WebGL, Drag or Tick
* При изменения положения, соединения проистраиваются в реальном времени

### 25.03.19
* Полностью исправлена утечка памяти при удалении сцены.
* Убран скрол - выставлен автоматически.
* Ось координат перенеслась в низ.
* Исправлен баг когда при наведении на атом, его наименование не оказывало

## License
[GNU](https://choosealicense.com/licenses/lgpl-3.0/)
