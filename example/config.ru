require 'sinatra'

get '/fast' do
  "OK\nFast"
end

get '/slow' do
  sleep 1
  "OK\nSlow"
end

run Sinatra::Application
