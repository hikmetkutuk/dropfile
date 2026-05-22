# Dropfile Backend

Go API server for the Dropfile application.

## go.mod

Modül tanım dosyasıdır. Projenin adını (`module github.com/hikmetkutuk/dropfile/backend`), minimum Go sürümünü (`go 1.26.1`) ve dış bağımlılıklarını (`require` blokları) tanımlar.

- `require (direct)` — bizim import ettiğimiz paketler
- `require (indirect)` — bağımlılıklarımızın getirdiği geçişli (transitive) paketler, doğrudan import edilmeyenler

Yeni bir paket kurmak istediğinde:

```bash
go get github.com/foo/bar@latest    # son sürüm
go mod tidy                           # kullanılmayanları temizle, eksikleri ekle
```

## go.sum

`go.sum`, go.mod'daki her bağımlılığın kriptografik hash'ini tutar. Amacı: projeyi kuran herkesin **birebir aynı** bağımlılık dosyalarını indiğinden emin olmak (supply-chain security). Elle düzenlenmez, `go mod tidy` otomatik günceller. Git'e commit edilir.

## Klasör Yapısı

```
backend/
├── cmd/server/main.go      # Giriş noktası
├── internal/
│   ├── config/config.go    # Ortam değişkenlerinden config okuma
│   ├── db/postgres.go      # DB bağlantı + auto-migration
│   ├── dto/auth.go         # Request/Response veri yapıları (Zod karşılığı)
│   ├── handler/auth.go     # HTTP handler'lar
│   └── model/
│       ├── file.go         # File entity
│       └── user.go         # User entity
├── migrations/             # SQL migration dosyaları
│   ├── 001_create_files_table.up.sql
│   ├── 001_create_files_table.down.sql
│   ├── 002_create_users_table.up.sql
│   └── 002_create_users_table.down.sql
├── go.mod
├── go.sum
└── Dockerfile
```

## Sık Kullanılan Komutlar

```bash
# Bağımlılık yönetimi
go get github.com/foo/bar@latest    # paket ekle / güncelle
go mod tidy                          # go.mod ve go.sum temizle
go mod download                      # tüm bağımlılıkları indir (build etmeden)
go mod verify                        # go.sum hash'lerini doğrula

# Build & Run
go build ./cmd/server/               # binary üret
go run ./cmd/server/                 # derle ve çalıştır
go vet ./...                         # statik analiz
go fmt ./...                         # kod formatla

# Test
go test ./...                        # tüm testleri çalıştır
go test -v -race ./...               # verbose + race detector
go test -coverprofile=coverage.out ./... # coverage raporu

# Migration (golang-migrate CLI ile)
migrate -path migrations -database "postgres://..." up       # tüm migration'ları uygula
migrate -path migrations -database "postgres://..." down     # son migration'ı geri al
migrate -path migrations -database "postgres://..." version  # mevcut versiyonu gör
migrate -path migrations -database "postgres://..." drop     # veritabanını sil (dikkat!)

# Migration (manuel — sunucu başlarken otomatik çalışır)
go run ./cmd/server/                  # startup'ta tüm pending migration'ları uygular

# Env değişkenleri (çalıştırmak için gerekli)
export DATABASE_URL='postgres://user:pass@localhost:5432/dropfile?sslmode=disable'
export JWT_SECRET='your-secret'
export PORT=8080                      # opsiyonel, default 8080
export CORS_ORIGIN='http://localhost:5173'  # opsiyonel
```

## Validation (Zod Karşılığı)

Go tarafında [go-playground/validator](https://github.com/go-playground/validator) struct tag'leri ile yapılır:

```go
// Zod:  z.object({ email: z.string().email(), password: z.string().min(8) })
// Go:
type RegisterRequest struct {
    Email    string `json:"email"    validate:"required,email,max=255"`
    Password string `json:"password" validate:"required,min=8,max=128"`
}
```

Handler'da `validate.Struct(req)` çağrısı Zod'un `schema.parse()` ile aynı işlevi görür. Regex, oneof, required_if gibi [tüm validasyonlar](https://pkg.go.dev/github.com/go-playground/validator/v10#hdr-Baked_In_Validators_and_Tags) desteklenir.
