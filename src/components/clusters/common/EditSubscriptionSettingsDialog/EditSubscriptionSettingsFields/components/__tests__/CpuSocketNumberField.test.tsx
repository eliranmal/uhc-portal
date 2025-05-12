import React from 'react';

import { defaultSubscription } from '~/components/clusters/common/__tests__/defaultClusterFromSubscription.fixtures';
import { checkAccessibility, render, screen, userEvent } from '~/testUtils';
import { SubscriptionCommonFieldsSystem_units as SubscriptionCommonFieldsSystemUnits } from '~/types/accounts_mgmt.v1';

import CpuSocketNumberField from '../CpuSocketNumberField';

describe('<CpuSocketNumberField />', () => {
  describe('is accessible', () => {
    it('when it is disconnected', async () => {
      // Act
      const { container } = render(
        <CpuSocketNumberField
          isDisconnected
          minVal={0}
          subscription={defaultSubscription}
          cpuSocketValue={0}
          cpuSocketLabel=""
          isDisabled={false}
          handleChange={jest.fn()}
        />,
      );

      // Assert
      await checkAccessibility(container);
    });

    it('when it is not disconnected', async () => {
      // Act
      const { container } = render(
        <CpuSocketNumberField
          isDisconnected={false}
          minVal={0}
          subscription={defaultSubscription}
          cpuSocketValue={0}
          cpuSocketLabel=""
          isDisabled={false}
          handleChange={jest.fn()}
        />,
      );

      // Assert
      await checkAccessibility(container);
    });
  });

  describe('properly renders', () => {
    describe('when it is disconnected', () => {
      it('when system units is not sockets', async () => {
        // Act
        render(
          <CpuSocketNumberField
            isDisconnected
            minVal={0}
            subscription={defaultSubscription}
            cpuSocketValue={10}
            cpuSocketLabel="whatever the label"
            isDisabled={false}
            handleChange={jest.fn()}
          />,
        );

        // Assert
        expect(
          screen.getByRole('button', {
            name: /decrement the number by 1/i,
          }),
        ).toBeInTheDocument();
        expect(
          screen.getByRole('spinbutton', {
            name: /number of compute cores \(excluding control plane nodes\)/i,
          }),
        ).toBeInTheDocument();
        expect(
          screen.getByRole('button', {
            name: /increment the number by 1/i,
          }),
        ).toBeInTheDocument();
      });

      it('when system units is sockets', async () => {
        // Act
        render(
          <CpuSocketNumberField
            isDisconnected
            minVal={0}
            subscription={{
              ...defaultSubscription,
              system_units: SubscriptionCommonFieldsSystemUnits.Sockets,
            }}
            cpuSocketValue={10}
            cpuSocketLabel="whatever the label"
            isDisabled={false}
            handleChange={jest.fn()}
          />,
        );

        // Assert
        expect(
          screen.getByRole('button', {
            name: /decrement the number by 1/i,
          }),
        ).toBeInTheDocument();
        expect(
          screen.getByRole('spinbutton', {
            name: /number of sockets \(excluding control plane nodes\)/i,
          }),
        ).toBeInTheDocument();
        expect(
          screen.getByRole('button', {
            name: /increment the number by 1/i,
          }),
        ).toBeInTheDocument();
      });
    });

    it('when it is not disconnected', () => {
      // Act
      render(
        <CpuSocketNumberField
          isDisconnected={false}
          minVal={0}
          subscription={defaultSubscription}
          cpuSocketValue={10}
          cpuSocketLabel="whatever the label"
          isDisabled={false}
          handleChange={jest.fn()}
        />,
      );

      // Assert
      expect(screen.getByText(/10 whatever the label/i)).toBeInTheDocument();
    });
  });

  describe('properly works', () => {
    describe('click on minus', () => {
      describe('min value', () => {
        it('when system units is not sockets', async () => {
          // Arrange
          const handleChangeMock = jest.fn();
          render(
            <CpuSocketNumberField
              isDisconnected
              minVal={0}
              subscription={defaultSubscription}
              cpuSocketValue={10}
              cpuSocketLabel="whatever the label"
              isDisabled={false}
              handleChange={handleChangeMock}
            />,
          );

          // Act
          await userEvent.click(
            screen.getByRole('button', {
              name: /decrement the number by 1/i,
            }),
          );

          // Assert
          expect(handleChangeMock).toHaveBeenCalledTimes(1);
          expect(handleChangeMock).toHaveBeenCalledWith('cpu_total', 1);
        });

        it('when system units is sockets', async () => {
          // Arrange
          const handleChangeMock = jest.fn();
          render(
            <CpuSocketNumberField
              isDisconnected
              minVal={0}
              subscription={{
                ...defaultSubscription,
                system_units: SubscriptionCommonFieldsSystemUnits.Sockets,
              }}
              cpuSocketValue={10}
              cpuSocketLabel="whatever the label"
              isDisabled={false}
              handleChange={handleChangeMock}
            />,
          );

          // Act
          await userEvent.click(
            screen.getByRole('button', {
              name: /decrement the number by 1/i,
            }),
          );

          // Assert
          expect(handleChangeMock).toHaveBeenCalledTimes(1);
          expect(handleChangeMock).toHaveBeenCalledWith('socket_total', 1);
        });
      });

      describe('subscription value', () => {
        it('when system units is not sockets', async () => {
          // Arrange
          const handleChangeMock = jest.fn();
          render(
            <CpuSocketNumberField
              isDisconnected
              minVal={0}
              subscription={{ ...defaultSubscription, cpu_total: 100, socket_total: 200 }}
              cpuSocketValue={10}
              cpuSocketLabel="whatever the label"
              isDisabled={false}
              handleChange={handleChangeMock}
            />,
          );

          // Act
          await userEvent.click(
            screen.getByRole('button', {
              name: /decrement the number by 1/i,
            }),
          );

          // Assert
          expect(handleChangeMock).toHaveBeenCalledTimes(1);
          expect(handleChangeMock).toHaveBeenCalledWith('cpu_total', 99);
        });

        it('when system units is sockets', async () => {
          // Arrange
          const handleChangeMock = jest.fn();
          render(
            <CpuSocketNumberField
              isDisconnected
              minVal={0}
              subscription={{
                ...defaultSubscription,
                system_units: SubscriptionCommonFieldsSystemUnits.Sockets,
                cpu_total: 100,
                socket_total: 200,
              }}
              cpuSocketValue={10}
              cpuSocketLabel="whatever the label"
              isDisabled={false}
              handleChange={handleChangeMock}
            />,
          );

          // Act
          await userEvent.click(
            screen.getByRole('button', {
              name: /decrement the number by 1/i,
            }),
          );

          // Assert
          expect(handleChangeMock).toHaveBeenCalledTimes(1);
          expect(handleChangeMock).toHaveBeenCalledWith('socket_total', 199);
        });
      });
    });
  });
});
