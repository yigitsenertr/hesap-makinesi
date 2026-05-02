import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import { useState } from 'react';

const { width } = Dimensions.get('window');
const BUTTON_SIZE = (width - 60) / 4;

export default function App() {
  const [current, setCurrent] = useState('0');
  const [previous, setPrevious] = useState('');
  const [operator, setOperator] = useState(null);
  const [shouldReset, setShouldReset] = useState(false);
  const [expression, setExpression] = useState('');

  const appendNumber = (num) => {
    if (shouldReset) {
      setCurrent(num);
      setShouldReset(false);
    } else {
      const newVal = current === '0' ? num : current + num;
      if (newVal.length <= 12) setCurrent(newVal);
    }
  };

  const appendDecimal = () => {
    if (shouldReset) {
      setCurrent('0.');
      setShouldReset(false);
    } else if (!current.includes('.')) {
      setCurrent(current + '.');
    }
  };

  const symbols = { '+': '+', '-': '−', '*': '×', '/': '÷' };

  const setOp = (op) => {
    if (operator && !shouldReset) {
      const result = compute(parseFloat(previous), parseFloat(current), operator);
      setPrevious(String(result));
      setCurrent(String(result));
      setExpression(String(result) + ' ' + symbols[op]);
    } else {
      setExpression(current + ' ' + symbols[op]);
      setPrevious(current);
    }
    setOperator(op);
    setShouldReset(true);
  };

  const compute = (a, b, op) => {
    switch (op) {
      case '+': return parseFloat((a + b).toFixed(10));
      case '-': return parseFloat((a - b).toFixed(10));
      case '*': return parseFloat((a * b).toFixed(10));
      case '/': return b !== 0 ? parseFloat((a / b).toFixed(10)) : 'Hata';
    }
  };

  const calculate = () => {
    if (!operator || !previous) return;
    const result = compute(parseFloat(previous), parseFloat(current), operator);
    setExpression(previous + ' ' + symbols[operator] + ' ' + current + ' =');
    setCurrent(String(result));
    setPrevious('');
    setOperator(null);
    setShouldReset(true);
  };

  const clearAll = () => {
    setCurrent('0');
    setPrevious('');
    setOperator(null);
    setShouldReset(false);
    setExpression('');
  };

  const toggleSign = () => {
    if (current !== '0' && current !== 'Hata') {
      setCurrent(current.startsWith('-') ? current.slice(1) : '-' + current);
    }
  };

  const percent = () => {
    if (current !== 'Hata') {
      setCurrent(String(parseFloat(current) / 100));
    }
  };

  const Button = ({ label, onPress, type = 'number', span = 1 }) => {
    const bgColors = {
      clear: '#e53e3e',
      operator: '#e67e22',
      equals: '#e67e22',
      utility: '#4a5568',
      number: '#2d3748',
    };
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        style={[
          styles.button,
          { backgroundColor: bgColors[type], width: span === 2 ? BUTTON_SIZE * 2 + 12 : BUTTON_SIZE },
        ]}
      >
        <Text style={styles.buttonText}>{label}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.display}>
        <Text style={styles.expression} numberOfLines={1}>{expression}</Text>
        <Text style={styles.result} numberOfLines={1} adjustsFontSizeToFit>
          {current}
        </Text>
      </View>

      <View style={styles.buttons}>
        <View style={styles.row}>
          <Button label="AC" type="clear" onPress={clearAll} />
          <Button label="+/-" type="utility" onPress={toggleSign} />
          <Button label="%" type="utility" onPress={percent} />
          <Button label="÷" type="operator" onPress={() => setOp('/')} />
        </View>
        <View style={styles.row}>
          <Button label="7" onPress={() => appendNumber('7')} />
          <Button label="8" onPress={() => appendNumber('8')} />
          <Button label="9" onPress={() => appendNumber('9')} />
          <Button label="×" type="operator" onPress={() => setOp('*')} />
        </View>
        <View style={styles.row}>
          <Button label="4" onPress={() => appendNumber('4')} />
          <Button label="5" onPress={() => appendNumber('5')} />
          <Button label="6" onPress={() => appendNumber('6')} />
          <Button label="−" type="operator" onPress={() => setOp('-')} />
        </View>
        <View style={styles.row}>
          <Button label="1" onPress={() => appendNumber('1')} />
          <Button label="2" onPress={() => appendNumber('2')} />
          <Button label="3" onPress={() => appendNumber('3')} />
          <Button label="+" type="operator" onPress={() => setOp('+')} />
        </View>
        <View style={styles.row}>
          <Button label="0" span={2} onPress={() => appendNumber('0')} />
          <Button label="." onPress={appendDecimal} />
          <Button label="=" type="equals" onPress={calculate} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    justifyContent: 'flex-end',
    paddingBottom: 40,
  },
  display: {
    paddingHorizontal: 24,
    paddingBottom: 20,
    alignItems: 'flex-end',
  },
  expression: {
    color: '#a0aec0',
    fontSize: 18,
    marginBottom: 4,
  },
  result: {
    color: '#ffffff',
    fontSize: 72,
    fontWeight: '200',
  },
  buttons: {
    paddingHorizontal: 12,
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  button: {
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: '400',
  },
});
