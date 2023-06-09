packer {
  required_plugins {
    googlecompute = {
      version = ">= 0.0.1"
      source  = "github.com/hashicorp/googlecompute"
    }
  }
}

variable "image-name-body" {
  type    = string
  default = "kintai"
}

variable "image-suffix" {
  type    = string
  default = "no-suffix"
}

variable "instance-size" {
  type    = string
  default = "60"
}

variable "source-image" {
  type    = string
  default = "ubuntu-2204-jammy-v20230606"
}

variable "project-id" {
  type    = string
  default = "__NO_PROJECT__"
}

variable "label-value" {
  type    = string
  default = "__NO_VALUE__"
}

source "googlecompute" "kintai" {
  project_id          = "${var.project-id}"
  source_image        = "${var.source-image}"
  ssh_username        = "packer"
  zone                = "asia-northeast1-b"
  startup_script_file = "startup.sh"
  image_name          = "${var.image-name-body}-${var.image-suffix}"
  machine_type        = "c2-standard-${var.instance-size}"
  image_labels        = {
    "kintai-label": "${var.label-value}"
  }
}

build {
  sources = [
    "sources.googlecompute.kintai"
  ]

  provisioner "shell" {
    inline = [
      "sudo mkdir -p /image-build",
      "sudo chmod 777 /image-build",
    ]
  }

  provisioner "file" {
    source      = "./image-build"
    destination = "/image-build"
  }
}
