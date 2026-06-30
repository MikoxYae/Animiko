# AniMiko Python HTML Frontend v3

Pure Python + HTML + CSS + JavaScript frontend. No npm, no React, no Node.js.

## Run

```bash
cd /root/Animiko
python3 miko.py
```

Default port: `7777`

## Allow port 7777

```bash
iptables -I INPUT 5 -p tcp --dport 7777 -j ACCEPT
apt install -y netfilter-persistent
netfilter-persistent save
```

## Background run

```bash
cd /root/Animiko
nohup python3 miko.py > animiko.log 2>&1 &
```

## Logs

```bash
tail -f /root/Animiko/animiko.log
```

Frontend only. Backend and MongoDB will be added later.
