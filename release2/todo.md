# 作業ログ

[2023-06-10 07:14:56]

手でインストールしようと思ったけど、イメージを作った方が早そうな気がしてきた

[2023-06-10 07:41:14]

https://cloud.google.com/build/docs/building/build-vm-images-with-packer?hl=ja

```
gcloud services enable sourcerepo.googleapis.com
gcloud services enable compute.googleapis.com
gcloud services enable servicemanagement.googleapis.com
gcloud services enable storage-api.googleapis.com
```

これの実行が必要だった
