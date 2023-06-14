#!/bin/bash


BUILD_DIR=/image-build
LOG_DIR=${BUILD_DIR}/log
mkdir -p ${LOG_DIR}


${BUILD_DIR}/root.sh 2>&1 | tee ${LOG_DIR}/root.log
