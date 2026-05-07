# Mobile Architecture (Flutter)

**Pattern:** Clean Architecture + Riverpod

---

## Project Structure

```
apps/mobile/
├── lib/
│   ├── main.dart
│   ├── app.dart                    # App root + router
│   ├── core/
│   │   ├── constants/              # API URLs, theme constants
│   │   ├── errors/                 # Failure types
│   │   ├── network/
│   │   │   ├── dio_client.dart     # Dio + interceptors
│   │   │   └── ws_client.dart      # WebSocket manager
│   │   ├── storage/
│   │   │   ├── secure_storage.dart # JWT tokens
│   │   │   └── hive_storage.dart   # Offline cache
│   │   └── utils/                  # Formatters, validators
│   ├── features/
│   │   ├── auth/
│   │   │   ├── data/
│   │   │   │   ├── auth_repository.dart
│   │   │   │   └── auth_remote_ds.dart
│   │   │   ├── domain/
│   │   │   │   ├── models/user.dart
│   │   │   │   └── auth_provider.dart
│   │   │   └── presentation/
│   │   │       ├── login_screen.dart
│   │   │       ├── register_screen.dart
│   │   │       └── widgets/
│   │   ├── chart/
│   │   │   ├── data/               # OHLCV repository
│   │   │   ├── domain/             # Chart state providers
│   │   │   └── presentation/
│   │   │       ├── chart_screen.dart
│   │   │       └── widgets/
│   │   │           ├── candlestick_chart.dart  # Custom painter
│   │   │           ├── indicator_overlay.dart
│   │   │           ├── drawing_layer.dart
│   │   │           └── timeframe_selector.dart
│   │   ├── watchlist/
│   │   ├── alerts/
│   │   ├── explore/
│   │   ├── terminal/
│   │   ├── profile/
│   │   └── settings/
│   └── shared/
│       ├── widgets/
│       │   ├── price_ticker.dart
│       │   ├── symbol_search.dart
│       │   ├── asset_badge.dart
│       │   └── notification_bell.dart
│       └── theme/
│           ├── app_theme.dart
│           └── colors.dart
```

---

## Navigation (go_router)

```
/ → SplashScreen
/auth/login → LoginScreen
/auth/register → RegisterScreen
/terminal → MainTerminal (BottomNavigationBar)
  /terminal/chart/:symbol → ChartScreen
  /terminal/watchlist → WatchlistScreen
  /terminal/explore → ExploreScreen
  /terminal/alerts → AlertsScreen
  /terminal/profile → ProfileScreen
```

---

## State Management (Riverpod)

| Provider | Manages |
|----------|---------|
| `authProvider` | User auth state |
| `chartProvider` | Active symbol, timeframe, candles |
| `wsProvider` | WebSocket connection state |
| `watchlistProvider` | Watchlist data + real-time updates |
| `alertsProvider` | Alerts list + trigger state |
| `indicatorsProvider` | Active indicators + configs |

---

## Chart Rendering (Custom Canvas Painter)

```dart
class CandlestickPainter extends CustomPainter {
  final List<OHLCV> candles;
  final double candleWidth;
  final double visibleStart;

  @override
  void paint(Canvas canvas, Size size) {
    for (final candle in visibleCandles) {
      // Draw wick
      canvas.drawLine(
        Offset(x, toY(candle.high)),
        Offset(x, toY(candle.low)),
        wickPaint,
      );
      // Draw body
      canvas.drawRect(
        Rect.fromLTWH(x - candleWidth/2, top, candleWidth, height),
        bodyPaint..color = candle.close >= candle.open ? Colors.green : Colors.red,
      );
    }
  }

  @override
  bool shouldRepaint(CandlestickPainter oldDelegate) =>
    oldDelegate.candles != candles;
}
```

- Renders directly to Canvas (no bridge overhead)
- 60fps target via `RepaintBoundary` + `shouldRepaint` optimization
- Gesture detection: `GestureDetector` for pan + `ScaleGestureDetector`
- Crosshair via overlay positioned widget
- Indicator painters: separate layer using `Stack`

---

## Dependencies (pubspec.yaml)

```yaml
dependencies:
  flutter_riverpod: ^2.5.0
  go_router: ^14.0.0
  dio: ^5.4.0
  web_socket_channel: ^2.4.0
  flutter_secure_storage: ^9.2.0
  local_auth: ^2.3.0
  firebase_messaging: ^14.9.0
  flutter_local_notifications: ^17.2.0
  hive_flutter: ^1.1.0
  fl_chart: ^0.68.0
  cached_network_image: ^3.3.0
  intl: ^0.19.0

dev_dependencies:
  flutter_test:
    sdk: flutter
  mocktail: ^1.0.4
  build_runner: ^2.4.8
```

---

## CI/CD Pipeline (Mobile)

```yaml
# .github/workflows/mobile.yml
- Build Flutter APK + IPA
- Run widget tests
- Upload to Firebase App Distribution (staging)
- Tag release → Fastlane → App Store + Play Store
```
