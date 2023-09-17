FROM quay.io/afx-abu/abu-md
RUN git clone https://github.com/Lokixgod75/lokixjs /root/Lokixgod75/
WORKDIR /root/Lokixgod75/
RUN yarn install --network-concurrency 1
CMD ["npm", "index.js"]
