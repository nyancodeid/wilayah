# JSON-API Data Administratif Indonesia
Hosting menggunakan Github Pages dan Cloudflare. Berdasarkan data terbaru dari repository [github.com/ichadhr/db-wilayah-indonesia](https://github.com/ichadhr/db-wilayah-indonesia).

## cURL
```shell
curl -v https://area.nyandev.id/provinsi.json
```

## Cara Penggunaan
### Provinsi
Ambil daftar provinsi dan data provinsi berdasarkan id.

```shell
https://area.nyandev.id/provinsi.json
https://area.nyandev.id/provinsi/1.json
```

Contoh Response

```json
[
  {
    "id": 1,
    "name": "Aceh",
    "hash": "03b632315ee5bee654b60a6bd902a249"
  },
  {
    "id": 2,
    "name": "Sumatra Utara",
    "hash": "6fe97b358b528edc477ba63d50b652af"
  },
  ...
]
```

### Kabupaten
Ambil daftar kabupaten atau ibukota pada id provinsi tertentu

```shell
https://area.nyandev.id/provinsi/{ID_PROVINSI}/kabupaten.json

https://area.nyandev.id/provinsi/1/kabupaten.json
https://area.nyandev.id/provinsi/1/ibukota.json
```

Contoh Response

```json
[
  {
    "id": 1,
    "pid": 1,
    "name": "Kabupaten Aceh Barat",
    "ibukota": "Meulaboh",
    "bsni": "MBO",
    "hash": "55c736929de7af1ca48c9439bd122cec"
  },
  {
    "id": 2,
    "pid": 1,
    "name": "Kabupaten Aceh Barat Daya",
    "ibukota": "Blangpidie",
    "bsni": "BPD",
    "hash": "a49b5afb6317f99be873c4f4ad6d178d"
  },
  ...
]
```

### Kecamatan
Ambil daftar kecamatan berdasarkan id kabupaten.

```shell
https://area.nyandev.id/provinsi/kabupaten/{ID_KABUPATEN}/kecamatan.json

https://area.nyandev.id/provinsi/kabupaten/1/kecamatan.json
```

Contoh Response

```json
[
  {
    "id": 1,
    "kabid": 1,
    "name": "Arongan Lambalek",
    "hash": "55c736929de7af1ca48c9439bd122cec"
  },
  {
    "id": 2,
    "kabid": 1,
    "name": "Bubon",
    "hash": "a49b5afb6317f99be873c4f4ad6d178d"
  },
  ...
]
```

### Kelurahan
Ambil daftar kelurahan berdasarkan id kecamatan.

```shell
https://area.nyandev.id/provinsi/kabupaten/kecamatan/{ID_KECAMATAN}/kelurahan.json

https://area.nyandev.id/provinsi/kabupaten/kecamatan/1/kelurahan.json
```

Contoh Response

```json
[
  {
    "id": 1,
    "kecid": 1,
    "name": "Alue Bagok",
    "hash": "4300e5fa2eaf0525f0d70f7439ace806"
  },
  {
    "id": 2,
    "kecid": 1,
    "name": "Alue Batee",
    "hash": "cfb12720845177f1e7379fd331bda8be"
  },
  ...
]
```

### Hash
Berisi tiap data administratif wilayah dari Provinsi-Kelurahan di pecah menjadi 1 json file.

```shell
https://area.nyandev.id/find/{HASH}.json

https://area.nyandev.id/find/4ec1a19f9625c3d0267c5be1acea30e1.json
```

Contoh Response

```json
{
  "id": 3391,
  "kabid": 235,
  "name": "Jombang",
  "hash": "4ec1a19f9625c3d0267c5be1acea30e1"
}
```

## Performance
Dengan menggunakan Cloudflare CDN diharapkan latency yang didapat dibawah `200ms`.

![Tools KeyCDN Performance Test](https://telegra.ph/file/65e9357b831fda385a535.png)

## Demo

- [Select2 + jQuery + Bootstrap](https://jsfiddle.net/4up5rs7w/43/)

## Development
```shell
git clone https://github.com/nyancodeid/wilayah.git

npm install

npm run build
```