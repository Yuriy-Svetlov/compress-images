#!/bin/sh
dir=lib/data

cert=0
curl https://curl.haxx.se/ca/cacert.pem | while read line; do
  if [ "-----BEGIN CERTIFICATE-----" == "$line" ]; then
      cert=1
      echo $line
  elif [ "-----END CERTIFICATE-----" == "$line" ]; then
      cert=0
      echo $line
  else
      if [ $cert == 1 ]; then
          echo $line
      fi
  fi
done > $dir/cacert.pem
