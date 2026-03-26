import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Platform } from 'react-native';
import {
  TextInput,
  Button,
  Text,
  HelperText,
  IconButton,
  Divider,
} from 'react-native-paper';
import { palette } from '../constants/Colors';
import { DEFAULT_ACCOUNT_ID } from '../constants/Config';
import { useAppState } from '../context/AppContext';

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default function SettingsScreen() {
  const { state, dispatch } = useAppState();
  const [newId, setNewId] = useState('');
  const [newAlias, setNewAlias] = useState('');
  const [error, setError] = useState('');

  const handleAdd = () => {
    const trimmedId = newId.trim();
    const trimmedAlias = newAlias.trim();

    if (!trimmedId) {
      setError('Account ID is required');
      return;
    }
    if (!UUID_REGEX.test(trimmedId)) {
      setError('Must be a valid UUID');
      return;
    }
    if (state.accounts.some((a) => a.id === trimmedId)) {
      setError('Account already exists');
      return;
    }

    const alias = trimmedAlias || `Account #${state.accounts.length + 1}`;
    dispatch({ type: 'ADD_ACCOUNT', payload: { id: trimmedId, alias } });
    setNewId('');
    setNewAlias('');
    setError('');
  };

  const handleRemove = (id: string) => {
    if (id === DEFAULT_ACCOUNT_ID) return;
    dispatch({ type: 'REMOVE_ACCOUNT', payload: id });
  };

  const handleSelect = (id: string) => {
    dispatch({ type: 'SET_SELECTED_ACCOUNT', payload: id });
  };

  return (
    <View style={styles.container}>
      <View style={styles.addSection}>
        <Text variant="titleMedium" style={styles.heading}>
          Add Account
        </Text>

        <TextInput
          label="Alias (e.g. Savings)"
          value={newAlias}
          onChangeText={setNewAlias}
          mode="outlined"
          style={styles.input}
          outlineColor={palette.border}
          activeOutlineColor={palette.primary}
          autoCapitalize="words"
        />
        <View style={styles.spacer} />

        <TextInput
          label="Account ID (UUID)"
          value={newId}
          onChangeText={(text) => {
            setNewId(text);
            if (error) setError('');
          }}
          mode="outlined"
          style={styles.input}
          outlineColor={palette.border}
          activeOutlineColor={palette.primary}
          error={!!error}
          autoCapitalize="none"
        />
        <HelperText type="error" visible={!!error}>
          {error}
        </HelperText>

        <Button
          mode="contained"
          onPress={handleAdd}
          style={styles.button}
          buttonColor={palette.primary}
          icon="plus"
        >
          Add Account
        </Button>
      </View>

      <View style={styles.listHeader}>
        <Text variant="titleMedium" style={styles.heading}>
          Managed Accounts
        </Text>
      </View>

      <FlatList
        data={state.accounts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const isDefault = item.id === DEFAULT_ACCOUNT_ID;
          const isSelected = item.id === state.selectedAccountId;

          return (
            <View style={[styles.accountRow, isSelected && styles.selectedRow]}>
              <View style={styles.accountInfo}>
                <Text
                  variant="bodyLarge"
                  style={[styles.aliasText, isSelected && styles.selectedText]}
                >
                  {item.alias}
                </Text>
                <Text
                  variant="bodySmall"
                  style={styles.accountId}
                  numberOfLines={1}
                >
                  {item.id}
                </Text>
                <View style={styles.badges}>
                  {isDefault && (
                    <Text variant="labelSmall" style={styles.defaultBadge}>
                      DEFAULT
                    </Text>
                  )}
                  {isSelected && (
                    <Text variant="labelSmall" style={styles.activeBadge}>
                      ACTIVE
                    </Text>
                  )}
                </View>
              </View>

              <View style={styles.actions}>
                {!isSelected && (
                  <Button
                    mode="text"
                    compact
                    onPress={() => handleSelect(item.id)}
                    textColor={palette.primary}
                  >
                    Select
                  </Button>
                )}
                {!isDefault && (
                  <IconButton
                    icon="delete-outline"
                    iconColor={palette.error}
                    size={20}
                    onPress={() => handleRemove(item.id)}
                  />
                )}
              </View>
            </View>
          );
        }}
        ItemSeparatorComponent={Divider}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.background,
  },
  addSection: {
    padding: 20,
    backgroundColor: palette.surface,
  },
  heading: {
    marginBottom: 12,
    color: palette.textPrimary,
    fontWeight: '600',
  },
  input: {
    backgroundColor: palette.surface,
  },
  spacer: {
    height: 8,
  },
  button: {
    borderRadius: 8,
    paddingVertical: 2,
  },
  listHeader: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 4,
  },
  listContent: {
    paddingBottom: 24,
  },
  accountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginVertical: 6,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: palette.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: palette.border,
  },
  selectedRow: {
    borderColor: palette.primary,
    backgroundColor: palette.primaryLight + '30',
  },
  accountInfo: {
    flex: 1,
    marginRight: 8,
  },
  aliasText: {
    fontWeight: '600',
    color: palette.textPrimary,
  },
  accountId: {
    color: palette.textSecondary,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 11,
    marginTop: 3,
  },
  badges: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 6,
  },
  defaultBadge: {
    color: palette.textSecondary,
    fontSize: 10,
    backgroundColor: palette.border,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: 'hidden',
  },
  activeBadge: {
    color: palette.primaryDark,
    fontSize: 10,
    backgroundColor: palette.primaryLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: 'hidden',
  },
  selectedText: {
    color: palette.primaryDark,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
