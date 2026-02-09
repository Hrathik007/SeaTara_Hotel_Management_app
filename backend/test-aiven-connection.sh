#!/bin/bash

# Test Aiven MySQL Connection
# This script helps verify that your Aiven MySQL database is accessible

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "   SITARA HOTEL - AIVEN MYSQL CONNECTION TESTER"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# REPLACE THESE WITH YOUR ACTUAL AIVEN VALUES
# Get them from: https://console.aiven.io/ > Your MySQL Service > Service URI
AIVEN_HOST="sitara-hotel-mysql-YOUR-HOST.aivencloud.com"
AIVEN_PORT="12345"
AIVEN_USER="avnadmin"
AIVEN_PASSWORD="YOUR_AIVEN_PASSWORD_HERE"
AIVEN_DATABASE="defaultdb"

echo "⚠️  BEFORE RUNNING:"
echo "   Edit this file and replace the placeholder values with your actual Aiven credentials"
echo ""
echo "📋 Current Configuration:"
echo "   Host: $AIVEN_HOST"
echo "   Port: $AIVEN_PORT"
echo "   User: $AIVEN_USER"
echo "   Database: $AIVEN_DATABASE"
echo ""

# Check if values have been updated
if [[ "$AIVEN_HOST" == *"YOUR-HOST"* ]]; then
    echo "❌ ERROR: Please edit this script and add your actual Aiven credentials"
    echo ""
    echo "Steps:"
    echo "1. Go to https://console.aiven.io/"
    echo "2. Click your MySQL service"
    echo "3. Copy the Service URI"
    echo "4. Edit this script and replace the placeholder values"
    echo ""
    exit 1
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "TEST 1: DNS Resolution"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Testing if hostname resolves..."

if command -v nslookup &> /dev/null; then
    nslookup "$AIVEN_HOST"
    if [ $? -eq 0 ]; then
        echo "✅ DNS resolution successful"
    else
        echo "❌ DNS resolution failed"
        echo "   This means the hostname is wrong or the Aiven service is not accessible"
        exit 1
    fi
else
    echo "⚠️  nslookup not found, trying ping..."
    ping -c 1 "$AIVEN_HOST" &> /dev/null
    if [ $? -eq 0 ]; then
        echo "✅ Host is reachable"
    else
        echo "❌ Host is not reachable"
        exit 1
    fi
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "TEST 2: Port Connectivity"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Testing if port $AIVEN_PORT is open..."

if command -v nc &> /dev/null; then
    nc -zv "$AIVEN_HOST" "$AIVEN_PORT" 2>&1
    if [ $? -eq 0 ]; then
        echo "✅ Port $AIVEN_PORT is open"
    else
        echo "❌ Port $AIVEN_PORT is not accessible"
        exit 1
    fi
elif command -v telnet &> /dev/null; then
    timeout 5 telnet "$AIVEN_HOST" "$AIVEN_PORT" 2>&1 | grep -q "Connected"
    if [ $? -eq 0 ]; then
        echo "✅ Port $AIVEN_PORT is open"
    else
        echo "❌ Port $AIVEN_PORT is not accessible"
    fi
else
    echo "⚠️  nc/telnet not found, skipping port test"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "TEST 3: MySQL Connection"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if command -v mysql &> /dev/null; then
    echo "Testing MySQL connection..."
    echo "Running: mysql -h $AIVEN_HOST -P $AIVEN_PORT -u $AIVEN_USER --ssl-mode=REQUIRED $AIVEN_DATABASE -e 'SELECT VERSION();'"
    echo ""

    MYSQL_PWD="$AIVEN_PASSWORD" mysql -h "$AIVEN_HOST" -P "$AIVEN_PORT" -u "$AIVEN_USER" --ssl-mode=REQUIRED "$AIVEN_DATABASE" -e "SELECT VERSION();" 2>&1

    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ MySQL connection successful!"
        echo ""
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo "TEST 4: Checking Database Tables"
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo ""

        MYSQL_PWD="$AIVEN_PASSWORD" mysql -h "$AIVEN_HOST" -P "$AIVEN_PORT" -u "$AIVEN_USER" --ssl-mode=REQUIRED "$AIVEN_DATABASE" -e "SHOW TABLES;" 2>&1

        echo ""
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo "TEST 5: Checking Users Table"
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo ""

        MYSQL_PWD="$AIVEN_PASSWORD" mysql -h "$AIVEN_HOST" -P "$AIVEN_PORT" -u "$AIVEN_USER" --ssl-mode=REQUIRED "$AIVEN_DATABASE" -e "SELECT id, email, name, role FROM users;" 2>&1

        echo ""
        echo "✅✅✅ ALL TESTS PASSED! ✅✅✅"
        echo ""
        echo "Your Aiven MySQL database is working correctly!"
        echo "You can use these credentials on Render."

    else
        echo ""
        echo "❌ MySQL connection failed"
        echo ""
        echo "Common issues:"
        echo "1. Wrong password - copy it exactly from Aiven Service URI"
        echo "2. Service not running - check Aiven Console"
        echo "3. SSL required - make sure to use --ssl-mode=REQUIRED"
    fi
else
    echo "⚠️  MySQL client not installed"
    echo ""
    echo "To install on macOS:"
    echo "  brew install mysql-client"
    echo ""
    echo "Your JDBC URL should be:"
    echo "jdbc:mysql://$AIVEN_HOST:$AIVEN_PORT/$AIVEN_DATABASE?sslMode=REQUIRED&serverTimezone=UTC&allowPublicKeyRetrieval=true"
    echo ""
    echo "Set these on Render:"
    echo "SPRING_DATASOURCE_URL=jdbc:mysql://$AIVEN_HOST:$AIVEN_PORT/$AIVEN_DATABASE?sslMode=REQUIRED&serverTimezone=UTC&allowPublicKeyRetrieval=true"
    echo "SPRING_DATASOURCE_USERNAME=$AIVEN_USER"
    echo "SPRING_DATASOURCE_PASSWORD=$AIVEN_PASSWORD"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

